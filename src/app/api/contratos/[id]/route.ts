import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, fornecedores, aditivos, reajustes, documentos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { contratoSchema } from '@/lib/validations';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const [contrato] = await db
      .select()
      .from(contratos)
      .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
      .where(eq(contratos.id, id));
    if (!contrato) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const [aditivosList, reajustesList, documentosList] = await Promise.all([
      db.select().from(aditivos).where(eq(aditivos.contratoId, id)),
      db.select().from(reajustes).where(eq(reajustes.contratoId, id)),
      db.select().from(documentos).where(eq(documentos.contratoId, id)),
    ]);

    return NextResponse.json({ data: { ...contrato, aditivos: aditivosList, reajustes: reajustesList, documentos: documentosList } });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = contratoSchema.partial().parse(body);
    const updateData: Record<string, unknown> = { ...validated, atualizadoEm: new Date() };
    if (validated.valorTotal !== undefined) updateData.valorTotal = String(validated.valorTotal);
    if (validated.valorMensal !== undefined) updateData.valorMensal = String(validated.valorMensal);
    if (validated.slaMeta !== undefined) updateData.slaMeta = String(validated.slaMeta);
    if (validated.dataInicio) updateData.dataInicio = new Date(validated.dataInicio);
    if (validated.dataTermino) updateData.dataTermino = new Date(validated.dataTermino);
    if (validated.dataAssinatura) updateData.dataAssinatura = new Date(validated.dataAssinatura);

    const [updated] = await db.update(contratos).set(updateData).where(eq(contratos.id, id)).returning();
    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'EDITOU', entidade: 'contrato', entidadeId: id });
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const [updated] = await db
      .update(contratos)
      .set({ situacao: 'encerrado', atualizadoEm: new Date() })
      .where(eq(contratos.id, id))
      .returning();
    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'ENCERROU', entidade: 'contrato', entidadeId: id });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
