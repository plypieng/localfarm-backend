import { getServerSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

/**
 * Retrieves the current user's ID from the session.
 * @returns {Promise<string | null>} The user ID if authenticated, otherwise null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    // The session is properly typed through our next-auth.d.ts declaration
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}
