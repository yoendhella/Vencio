import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, fornecedores } from '@/db/schema';
import { eq, isNotNull, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');

    const condition = status
      ? and(isNotNull(contratos.slaIndicador), eq(contratos.slaStatus, status as 'conforme'))
      : isNotNull(contratos.slaIndicador);

    const data = await db
      .select({
        id: contratos.id,
        numero: contratos.numero,
        nome: contratos.nome,
        slaIndicador: contratos.slaIndicador,
        slaMeta: contratos.slaMeta,
        slaRealizado: contratos.slaRealizado,
        slaStatus: contratos.slaStatus,
        fornecedorNome: fornecedores.razaoSocial,
        dataTermino: contratos.dataTermino,
        situacao: contratos.situacao,
      })
      .from(contratos)
      .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
      .where(condition);

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
