import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        senha: { type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const senha = credentials.senha as string;

        const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));

        if (!user) return null;
        if (!user.ativo) throw new Error('inactive');
        if (!user.senhaHash) throw new Error('no_password');

        const ok = await bcrypt.compare(senha, user.senhaHash);
        if (!ok) throw new Error('wrong_password');

        return { id: user.id, name: user.nome, email: user.email, role: user.perfil };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
});
