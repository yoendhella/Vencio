import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { logsAuditoria } from '@/db/schema';
import { eq, desc, SQL } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 25);
    const usuarioId = searchParams.get('usuarioId');
    const acao = searchParams.get('acao');
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (usuarioId) conditions.push(eq(logsAuditoria.usuarioId, usuarioId));
    if (acao) conditions.push(eq(logsAuditoria.acao, acao));

    const data = await db
      .select()
      .from(logsAuditoria)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(logsAuditoria.criadoEm))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data, page, limit });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
