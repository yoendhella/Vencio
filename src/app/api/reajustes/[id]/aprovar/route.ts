import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { reajustes, contratos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { log } from '@/lib/audit';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const [reajuste] = await db.select().from(reajustes).where(eq(reajustes.id, id));
    if (!reajuste) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const [updated] = await db
      .update(reajustes)
      .set({ status: 'aprovado', aprovadoPorId: session.user.id, aprovadoEm: new Date() })
      .where(eq(reajustes.id, id))
      .returning();

    await db
      .update(contratos)
      .set({ valorMensal: reajuste.novoValor, atualizadoEm: new Date() })
      .where(eq(contratos.id, reajuste.contratoId));

    await log({
      usuarioId: session.user.id,
      nomeUsuario: session.user.name!,
      acao: 'APROVOU_REAJUSTE',
      entidade: 'reajuste',
      entidadeId: id,
      detalhes: `Índice ${reajuste.indice} ${reajuste.percentual}%`,
    });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
