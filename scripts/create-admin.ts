/**
 * Script para criar ou atualizar um usuário administrador no banco.
 *
 * Uso:
 *   dotenv-cli -e .env.local -- tsx scripts/create-admin.ts
 *
 * Ou com variável direta:
 *   DATABASE_URL="..." tsx scripts/create-admin.ts
 *
 * Parâmetros opcionais via env:
 *   ADMIN_EMAIL  (padrão: admin@empresa.com.br)
 *   ADMIN_NOME   (padrão: Administrador)
 *   ADMIN_SENHA  (padrão: Admin@2026)
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL não definida.');
  console.error('    Execute: dotenv-cli -e .env.local -- tsx scripts/create-admin.ts');
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL ?? 'admin@empresa.com.br';
const nome  = process.env.ADMIN_NOME  ?? 'Administrador';
const senha = process.env.ADMIN_SENHA ?? 'Admin@2026';

async function main() {
  console.log('\n🔧  Conectando ao banco de dados...');
  const sql = neon(DATABASE_URL!);
  const db  = drizzle(sql, { schema });

  console.log(`👤  Verificando usuário: ${email}`);
  const existing = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.email, email));

  const senhaHash = await bcrypt.hash(senha, 12);

  if (existing.length > 0) {
    await db
      .update(schema.usuarios)
      .set({ senhaHash, perfil: 'administrador', ativo: true })
      .where(eq(schema.usuarios.email, email));

    console.log(`✅  Usuário atualizado com sucesso!`);
    console.log(`    Email : ${email}`);
    console.log(`    Perfil: administrador`);
    console.log(`    Senha : ${senha}`);
  } else {
    const [created] = await db
      .insert(schema.usuarios)
      .values({ nome, email, senhaHash, perfil: 'administrador', ativo: true })
      .returning();

    console.log(`✅  Usuário criado com sucesso!`);
    console.log(`    ID    : ${created.id}`);
    console.log(`    Nome  : ${created.nome}`);
    console.log(`    Email : ${created.email}`);
    console.log(`    Perfil: administrador`);
    console.log(`    Senha : ${senha}`);
  }

  console.log('\n🚀  Acesse: https://vencio.vercel.app/login\n');
}

main().catch((err) => {
  console.error('❌  Erro:', err.message);
  process.exit(1);
});
