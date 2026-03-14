import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { documentos } from '@/db/schema';
import { eq, and, SQL } from 'drizzle-orm';
import { z } from 'zod';

const documentoSchema = z.object({
  contratoId: z.string().uuid().optional(),
  nome: z.string().min(1),
  tipo: z.enum(['contrato', 'aditivo', 'proposta', 'nf_fiscal', 'certidao', 'sla', 'outro']),
  url: z.string().url(),
  tamanhoBytes: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const contratoId = searchParams.get('contratoId');
    const tipo = searchParams.get('tipo');

    const conditions: SQL[] = [];
    if (contratoId) conditions.push(eq(documentos.contratoId, contratoId));
    if (tipo) conditions.push(eq(documentos.tipo, tipo as 'contrato'));

    const data = await db
      .select()
      .from(documentos)
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
    const validated = documentoSchema.parse(body);
    const [created] = await db
      .insert(documentos)
      .values({ ...validated, uploadadoPorId: session.user.id })
      .returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
