import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { fornecedores } from '@/db/schema';
import { eq, like, and, SQL } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { fornecedorSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q');
    const categoria = searchParams.get('categoria');

    const conditions: SQL[] = [];
    if (q) conditions.push(like(fornecedores.razaoSocial, `%${q}%`));
    if (categoria) conditions.push(eq(fornecedores.categoria, categoria));

    const data = await db
      .select()
      .from(fornecedores)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

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
    const validated = fornecedorSchema.parse(body);
    const [created] = await db
      .insert(fornecedores)
      .values({
        ...validated,
        notaQualidade: validated.notaQualidade !== undefined ? String(validated.notaQualidade) : undefined,
        notaPrazo: validated.notaPrazo !== undefined ? String(validated.notaPrazo) : undefined,
        notaComunicacao: validated.notaComunicacao !== undefined ? String(validated.notaComunicacao) : undefined,
        notaConformidade: validated.notaConformidade !== undefined ? String(validated.notaConformidade) : undefined,
      })
      .returning();
    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'CRIOU', entidade: 'fornecedor', entidadeId: created.id });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
