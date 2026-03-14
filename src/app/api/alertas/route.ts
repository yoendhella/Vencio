import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, certidoes, reajustes } from '@/db/schema';
import { eq, lte, and, count } from 'drizzle-orm';
import { addDays } from 'date-fns';

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const hoje = new Date();
    const em30 = addDays(hoje, 30);

    const [criticosResult] = await db
      .select({ total: count() })
      .from(contratos)
      .where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, em30)));

    const [certidoesResult] = await db
      .select({ total: count() })
      .from(certidoes)
      .where(lte(certidoes.dataValidade, addDays(hoje, 30)));

    const [reajustesResult] = await db
      .select({ total: count() })
      .from(reajustes)
      .where(eq(reajustes.status, 'pendente'));

    const [slaResult] = await db
      .select({ total: count() })
      .from(contratos)
      .where(eq(contratos.slaStatus, 'risco'));

    const criticos = criticosResult.total;
    const cert = certidoesResult.total;
    const reaj = reajustesResult.total;
    const sla = slaResult.total;
    const total = criticos + cert + reaj + sla;

    return NextResponse.json({ data: { criticos, certidoes: cert, reajustes: reaj, sla, total } });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
