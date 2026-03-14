import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { reajustes, contratos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { reajusteSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');

    const query = db
      .select({
        id: reajustes.id,
        contratoId: reajustes.contratoId,
        indice: reajustes.indice,
        percentual: reajustes.percentual,
        valorAnterior: reajustes.valorAnterior,
        novoValor: reajustes.novoValor,
        dataVigencia: reajustes.dataVigencia,
        status: reajustes.status,
        aprovadoEm: reajustes.aprovadoEm,
        criadoEm: reajustes.criadoEm,
        contratoNome: contratos.nome,
        contratoNumero: contratos.numero,
      })
      .from(reajustes)
      .leftJoin(contratos, eq(reajustes.contratoId, contratos.id));

    const data = status ? await query.where(eq(reajustes.status, status)) : await query;
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
    const validated = reajusteSchema.parse(body);
    const [created] = await db
      .insert(reajustes)
      .values({
        ...validated,
        percentual: String(validated.percentual),
        valorAnterior: String(validated.valorAnterior),
        novoValor: String(validated.novoValor),
        dataVigencia: new Date(validated.dataVigencia),
      })
      .returning();
    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'CRIOU', entidade: 'reajuste', entidadeId: created.id });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
