import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, fornecedores } from '@/db/schema';
import { eq, and, like, asc, SQL } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { contratoSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const categoria = searchParams.get('categoria');
    const departamento = searchParams.get('departamento');

    const conditions: SQL[] = [];
    if (q) conditions.push(like(contratos.nome, `%${q}%`));
    if (status) conditions.push(eq(contratos.situacao, status as 'ativo'));
    if (categoria) conditions.push(eq(contratos.categoria, categoria));
    if (departamento) conditions.push(eq(contratos.departamento, departamento));

    const data = await db
      .select({
        id: contratos.id,
        numero: contratos.numero,
        nome: contratos.nome,
        tipo: contratos.tipo,
        categoria: contratos.categoria,
        departamento: contratos.departamento,
        situacao: contratos.situacao,
        valorTotal: contratos.valorTotal,
        valorMensal: contratos.valorMensal,
        indicadorReajuste: contratos.indicadorReajuste,
        dataInicio: contratos.dataInicio,
        dataTermino: contratos.dataTermino,
        slaMeta: contratos.slaMeta,
        slaRealizado: contratos.slaRealizado,
        slaStatus: contratos.slaStatus,
        slaIndicador: contratos.slaIndicador,
        renovacaoAutomatica: contratos.renovacaoAutomatica,
        fornecedorId: contratos.fornecedorId,
        fornecedorNome: fornecedores.razaoSocial,
        criadoEm: contratos.criadoEm,
      })
      .from(contratos)
      .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(contratos.dataTermino));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const body = await req.json();
    const validated = contratoSchema.parse(body);
    const [created] = await db
      .insert(contratos)
      .values({
        ...validated,
        criadoPorId: session.user.id,
        valorTotal: String(validated.valorTotal),
        valorMensal: String(validated.valorMensal),
        slaMeta: validated.slaMeta !== undefined ? String(validated.slaMeta) : undefined,
        dataInicio: new Date(validated.dataInicio),
        dataTermino: new Date(validated.dataTermino),
        dataAssinatura: validated.dataAssinatura ? new Date(validated.dataAssinatura) : undefined,
      })
      .returning();
    await log({
      usuarioId: session.user.id,
      nomeUsuario: session.user.name!,
      acao: 'CRIOU',
      entidade: 'contrato',
      entidadeId: created.id,
      detalhes: `Contrato ${created.numero}`,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
