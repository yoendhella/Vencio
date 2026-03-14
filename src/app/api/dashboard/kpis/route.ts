import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, fornecedores, reajustes, aditivos, certidoes } from '@/db/schema';
import { eq, lte, and, count, sum, gte } from 'drizzle-orm';
import { addDays, startOfYear } from 'date-fns';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const hoje = new Date();
    const em30 = addDays(hoje, 30);
    const anoInicio = startOfYear(hoje);

    const [
      ativosResult, criticosResult, reajPendResult, fornAtivosResult,
      slaRiscoResult, certVencResult, aditivosAnoResult, mensalResult,
    ] = await Promise.all([
      db.select({ total: count() }).from(contratos).where(eq(contratos.situacao, 'ativo')),
      db.select({ total: count() }).from(contratos).where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, em30))),
      db.select({ total: count() }).from(reajustes).where(eq(reajustes.status, 'pendente')),
      db.select({ total: count() }).from(fornecedores).where(eq(fornecedores.ativo, true)),
      db.select({ total: count() }).from(contratos).where(eq(contratos.slaStatus, 'risco')),
      db.select({ total: count() }).from(certidoes).where(lte(certidoes.dataValidade, addDays(hoje, 30))),
      db.select({ total: count() }).from(aditivos).where(gte(aditivos.criadoEm, anoInicio)),
      db.select({ total: sum(contratos.valorMensal) }).from(contratos).where(eq(contratos.situacao, 'ativo')),
    ]);

    return NextResponse.json({
      data: {
        ativos: ativosResult[0].total,
        criticos: criticosResult[0].total,
        reajustesPendentes: reajPendResult[0].total,
        fornecedoresAtivos: fornAtivosResult[0].total,
        slaRisco: slaRiscoResult[0].total,
        certidoesAtencao: certVencResult[0].total,
        aditivosAno: aditivosAnoResult[0].total,
        valorMensalTotal: mensalResult[0].total ?? '0',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
