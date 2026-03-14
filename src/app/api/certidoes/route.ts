import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { certidoes, fornecedores } from '@/db/schema';
import { eq, lte, and, SQL } from 'drizzle-orm';
import { z } from 'zod';

const certidaoSchema = z.object({
  fornecedorId: z.string().uuid(),
  tipo: z.enum(['receita_federal', 'fgts', 'inss', 'trabalhista', 'estadual', 'municipal']),
  dataValidade: z.string().datetime(),
  documentoUrl: z.string().url().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const fornecedorId = searchParams.get('fornecedorId');
    const vencidas = searchParams.get('vencidas') === 'true';

    const conditions: SQL[] = [];
    if (fornecedorId) conditions.push(eq(certidoes.fornecedorId, fornecedorId));
    if (vencidas) conditions.push(lte(certidoes.dataValidade, new Date()));

    const data = await db
      .select({
        id: certidoes.id,
        fornecedorId: certidoes.fornecedorId,
        tipo: certidoes.tipo,
        dataValidade: certidoes.dataValidade,
        documentoUrl: certidoes.documentoUrl,
        criadoEm: certidoes.criadoEm,
        fornecedorNome: fornecedores.razaoSocial,
      })
      .from(certidoes)
      .leftJoin(fornecedores, eq(certidoes.fornecedorId, fornecedores.id))
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
    const validated = certidaoSchema.parse(body);
    const [created] = await db
      .insert(certidoes)
      .values({ ...validated, dataValidade: new Date(validated.dataValidade) })
      .returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
