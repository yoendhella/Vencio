import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { configuracoesAlerta } from '@/db/schema';

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const body = await req.json();
    const existing = await db.select().from(configuracoesAlerta).limit(1);
    if (existing.length > 0) {
      await db.update(configuracoesAlerta).set({ ...body, atualizadoEm: new Date() });
    } else {
      await db.insert(configuracoesAlerta).values({ ...body });
    }
    return NextResponse.json({ data: body });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const [config] = await db.select().from(configuracoesAlerta).limit(1);
    return NextResponse.json({ data: config ?? null });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
