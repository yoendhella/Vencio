import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { log } from '@/lib/audit';

const schema = z.object({
  nome:   z.string().min(2).optional(),
  email:  z.string().email().optional(),
  perfil: z.enum(['administrador', 'gestor', 'operacional', 'financeiro', 'visualizador']).optional(),
  senha:  z.string().min(8).optional(),
  ativo:  z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  if (session.user.role !== 'administrador') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = schema.parse(body);

    // Verificar email duplicado
    if (validated.email) {
      const emailConflict = await db
        .select({ id: usuarios.id })
        .from(usuarios)
        .where(and(eq(usuarios.email, validated.email), ne(usuarios.id, id)));
      if (emailConflict.length > 0) {
        return NextResponse.json({ error: 'E-mail já está em uso por outro usuário' }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (validated.nome  !== undefined) updateData.nome  = validated.nome;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.perfil !== undefined) updateData.perfil = validated.perfil;
    if (validated.ativo  !== undefined) updateData.ativo  = validated.ativo;
    if (validated.senha) updateData.senhaHash = await bcrypt.hash(validated.senha, 12);

    const [updated] = await db.update(usuarios).set(updateData).where(eq(usuarios.id, id)).returning();
    if (!updated) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    await log({ usuarioId: session.user.id, nomeUsuario: session.user.name!, acao: 'EDITOU', entidade: 'usuarios', entidadeId: id, detalhes: `Usuário ${updated.email} atualizado` });
    return NextResponse.json({ data: { ...updated, senhaHash: undefined } });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
