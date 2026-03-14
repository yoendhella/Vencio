import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { fornecedores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { fornecedorSchema } from '@/lib/validations';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const [data] = await db.select().from(fornecedores).where(eq(fornecedores.id, id));
    if (!data) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json({ data });
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
    const validated = fornecedorSchema.partial().parse(body);
    const updateData: Record<string, unknown> = { ...validated, atualizadoEm: new Date() };
    if (validated.notaQualidade !== undefined) updateData.notaQualidade = String(validated.notaQualidade);
    if (validated.notaPrazo !== undefined) updateData.notaPrazo = String(validated.notaPrazo);
    if (validated.notaComunicacao !== undefined) updateData.notaComunicacao = String(validated.notaComunicacao);
    if (validated.notaConformidade !== undefined) updateData.notaConformidade = String(validated.notaConformidade);

    const [updated] = await db.update(fornecedores).set(updateData).where(eq(fornecedores.id, id)).returning();
    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'EDITOU', entidade: 'fornecedor', entidadeId: id });
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
