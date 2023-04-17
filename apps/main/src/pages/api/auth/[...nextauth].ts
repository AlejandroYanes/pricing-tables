import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { env } from 'env/server.mjs';
import { prisma } from 'server/db';

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Include user.id on session
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isSetup = !!(user as any).stripeKey;
        session.user.role = (user as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin'
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
