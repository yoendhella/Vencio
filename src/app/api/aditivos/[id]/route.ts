import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { aditivos, contratos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { log } from '@/lib/audit';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const [aditivo] = await db.select().from(aditivos).where(eq(aditivos.id, id));
    if (!aditivo) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const [updated] = await db
      .update(aditivos)
      .set({ status, aprovadoPorId: session.user.id, aprovadoEm: new Date() })
      .where(eq(aditivos.id, id))
      .returning();

    if (status === 'aprovado') {
      const contractUpdate: Record<string, unknown> = { atualizadoEm: new Date() };
      if ((aditivo.tipo === 'valor' || aditivo.tipo === 'valor_prazo') && aditivo.novoValorMensal) {
        contractUpdate.valorMensal = aditivo.novoValorMensal;
      }
      if ((aditivo.tipo === 'prazo' || aditivo.tipo === 'valor_prazo') && aditivo.novaDataTermino) {
        contractUpdate.dataTermino = aditivo.novaDataTermino;
      }
      await db.update(contratos).set(contractUpdate).where(eq(contratos.id, aditivo.contratoId));
    }

    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: `ADITIVO_${status.toUpperCase()}`, entidade: 'aditivo', entidadeId: id });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
