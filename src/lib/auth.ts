import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { usuarios } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? 'common'}/v2.0`,
    }),
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
