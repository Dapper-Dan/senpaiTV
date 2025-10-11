import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role as string || 'authenticated';
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.role = (user as any).role || 'authenticated';
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
