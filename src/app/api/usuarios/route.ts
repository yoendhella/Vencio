import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { log } from '@/lib/audit';

const schema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  perfil: z.enum(['administrador', 'gestor', 'operacional', 'financeiro', 'visualizador']),
  senha: z.string().min(8),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const list = await db
      .select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email, perfil: usuarios.perfil, ativo: usuarios.ativo, criadoEm: usuarios.criadoEm, temSenha: usuarios.senhaHash })
      .from(usuarios)
      .orderBy(usuarios.nome);
    const data = list.map((u) => ({ ...u, temSenha: !!u.temSenha }));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  if (session.user.role !== 'administrador') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  try {
    const body = await req.json();
    const validated = schema.parse(body);

    const existing = await db.select().from(usuarios).where(eq(usuarios.email, validated.email));
    if (existing.length > 0) return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });

    const senhaHash = await bcrypt.hash(validated.senha, 12);
    const [created] = await db.insert(usuarios).values({
      nome: validated.nome,
      email: validated.email,
      perfil: validated.perfil,
      senhaHash,
    }).returning();

    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'CRIOU', entidade: 'usuarios', entidadeId: created.id, detalhes: `Usuário ${created.email} criado` });
    return NextResponse.json({ data: { ...created, senhaHash: undefined } }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
