import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contratos, certidoes, reajustes, configuracoesAlerta, fornecedores } from '@/db/schema';
import { eq, lte, and } from 'drizzle-orm';
import { addDays, isMonday } from 'date-fns';
import {
  enviarAlertaVencimento, enviarAlertaReajuste,
  enviarAlertaCertidao, enviarResumoSemanal,
} from '@/lib/email';
import { formatDate } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const [config] = await db.select().from(configuracoesAlerta).limit(1);
    const email = config?.emailDestinatario;
    if (!email) return NextResponse.json({ processados: 0, timestamp: new Date().toISOString() });

    let processados = 0;
    const hoje = new Date();

    // Contratos vencendo
    if (config?.alerta30dias || config?.alerta60dias || config?.alerta90dias) {
      const limite = config.alerta90dias ? 90 : config.alerta60dias ? 60 : 30;
      const contratosList = await db
        .select({ id: contratos.id, nome: contratos.nome, numero: contratos.numero, dataTermino: contratos.dataTermino, fornecedorId: contratos.fornecedorId })
        .from(contratos)
        .where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, addDays(hoje, limite))));

      for (const c of contratosList) {
        const dias = Math.ceil((c.dataTermino.getTime() - hoje.getTime()) / 86400000);
        const [f] = await db.select({ razaoSocial: fornecedores.razaoSocial }).from(fornecedores).where(eq(fornecedores.id, c.fornecedorId));
        await enviarAlertaVencimento({
          email,
          contratoNome: c.nome,
          contratoNumero: c.numero,
          fornecedor: f?.razaoSocial ?? '',
          diasRestantes: dias,
          dataTermino: formatDate(c.dataTermino),
        });
        processados++;
      }
    }

    // Certidões
    if (config?.alertaCertidao) {
      const certList = await db
        .select({ tipo: certidoes.tipo, dataValidade: certidoes.dataValidade, fornecedorId: certidoes.fornecedorId })
        .from(certidoes)
        .where(lte(certidoes.dataValidade, addDays(hoje, 30)));
      for (const c of certList) {
        const [f] = await db.select({ razaoSocial: fornecedores.razaoSocial }).from(fornecedores).where(eq(fornecedores.id, c.fornecedorId));
        const status = c.dataValidade < hoje ? 'vencida' : 'atencao';
        await enviarAlertaCertidao({ email, fornecedor: f?.razaoSocial ?? '', tipoCertidao: c.tipo, status, dataValidade: formatDate(c.dataValidade) });
        processados++;
      }
    }

    // Reajustes
    if (config?.alertaReajuste) {
      const reajList = await db
        .select({ id: reajustes.id, contratoId: reajustes.contratoId, indice: reajustes.indice, percentual: reajustes.percentual, valorAnterior: reajustes.valorAnterior, novoValor: reajustes.novoValor, dataVigencia: reajustes.dataVigencia })
        .from(reajustes)
        .where(eq(reajustes.status, 'pendente'));
      for (const r of reajList) {
        const [c] = await db.select({ nome: contratos.nome, numero: contratos.numero }).from(contratos).where(eq(contratos.id, r.contratoId));
        await enviarAlertaReajuste({
          email,
          contratoNome: c?.nome ?? '',
          contratoNumero: c?.numero ?? '',
          indice: r.indice,
          percentual: Number(r.percentual),
          valorAnterior: Number(r.valorAnterior),
          novoValor: Number(r.novoValor),
          dataVigencia: formatDate(r.dataVigencia),
        });
        processados++;
      }
    }

    // Resumo semanal
    if (config?.resumoSemanal && isMonday(hoje)) {
      const [[at], [cr], [rp], [cv]] = await Promise.all([
        db.select({ total: eq(contratos.situacao, 'ativo') }).from(contratos).where(eq(contratos.situacao, 'ativo')).limit(1),
        db.select({ total: eq(contratos.situacao, 'ativo') }).from(contratos).where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, addDays(hoje, 30)))).limit(1),
        db.select().from(reajustes).where(eq(reajustes.status, 'pendente')).limit(1),
        db.select().from(certidoes).where(lte(certidoes.dataValidade, hoje)).limit(1),
      ]);
      await enviarResumoSemanal({ email, ativos: at ? 1 : 0, criticos: cr ? 1 : 0, reajustesPendentes: rp ? 1 : 0, certidoesVencidas: cv ? 1 : 0 });
    }

    return NextResponse.json({ processados, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
