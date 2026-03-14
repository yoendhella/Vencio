import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { ocorrenciasSla, contratos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ocorrenciaSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const contratoId = searchParams.get('contratoId');

    const data = contratoId
      ? await db.select().from(ocorrenciasSla).where(eq(ocorrenciasSla.contratoId, contratoId))
      : await db.select().from(ocorrenciasSla);

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
    const validated = ocorrenciaSchema.parse(body);
    const [created] = await db
      .insert(ocorrenciasSla)
      .values({
        ...validated,
        penalidade: validated.penalidade !== undefined ? String(validated.penalidade) : undefined,
        dataOcorrencia: new Date(validated.dataOcorrencia),
      })
      .returning();

    // Recalculate SLA status
    const [contrato] = await db.select().from(contratos).where(eq(contratos.id, validated.contratoId));
    if (contrato && contrato.slaRealizado) {
      const realizado = Number(contrato.slaRealizado);
      const slaStatus = realizado >= 95 ? 'conforme' : realizado >= 80 ? 'atencao' : 'risco';
      await db.update(contratos).set({ slaStatus }).where(eq(contratos.id, validated.contratoId));
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
