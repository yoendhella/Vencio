import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { aditivos, contratos } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';
import { log } from '@/lib/audit';
import { aditivoSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const contratoId = searchParams.get('contratoId');

    const query = db
      .select({
        id: aditivos.id,
        numero: aditivos.numero,
        contratoId: aditivos.contratoId,
        tipo: aditivos.tipo,
        dataAditivo: aditivos.dataAditivo,
        novoValorMensal: aditivos.novoValorMensal,
        novaDataTermino: aditivos.novaDataTermino,
        motivo: aditivos.motivo,
        status: aditivos.status,
        aprovadoEm: aditivos.aprovadoEm,
        criadoEm: aditivos.criadoEm,
        contratoNome: contratos.nome,
        contratoNumero: contratos.numero,
      })
      .from(aditivos)
      .leftJoin(contratos, eq(aditivos.contratoId, contratos.id));

    const data = contratoId
      ? await query.where(eq(aditivos.contratoId, contratoId))
      : await query;

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
    const validated = aditivoSchema.parse(body);

    const [contrato] = await db.select().from(contratos).where(eq(contratos.id, validated.contratoId));
    if (!contrato) return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 });

    const [{ total }] = await db
      .select({ total: count() })
      .from(aditivos)
      .where(eq(aditivos.contratoId, validated.contratoId));

    if (total >= contrato.maxAditivos) {
      return NextResponse.json({ error: `Limite de ${contrato.maxAditivos} aditivos atingido` }, { status: 400 });
    }

    const [created] = await db
      .insert(aditivos)
      .values({
        ...validated,
        novoValorMensal: validated.novoValorMensal !== undefined ? String(validated.novoValorMensal) : undefined,
        dataAditivo: new Date(validated.dataAditivo),
        novaDataTermino: validated.novaDataTermino ? new Date(validated.novaDataTermino) : undefined,
      })
      .returning();

    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'CRIOU', entidade: 'aditivo', entidadeId: created.id });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
