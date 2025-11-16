import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;
        try {
          const rows = await prisma.$queryRawUnsafe<any[]>(
            `SELECT password_hash, salt FROM local_credentials WHERE email = $1`,
            email
          );
          if (!rows || rows.length === 0) return null;
          const { password_hash: storedHash, salt } = rows[0] as { password_hash: string; salt: string };
          const hash = crypto.scryptSync(password, salt, 64).toString('hex');
          if (hash !== storedHash) return null;

          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: { email },
          });
          return { id: user.id, email: user.email, name: user.name || user.email };
        } catch (e) {
          console.error('Credentials authorize error:', e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role as string || 'authenticated';
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        (token as any).role = (user as any).role || 'authenticated';
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
};


