import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { createId } from '@paralleldrive/cuid2';

import { env } from 'env/server.mjs';
import { prisma } from 'server/db';
import initDb from 'utils/planet-scale';

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Include user.id on session
    async session({ session, token }) {
      if (session.user) {
        // to be removed once the guest role is removed
        session.user.id = token.sub!;
        const db = initDb();
        // eslint-disable-next-line max-len
        const dbUser = (
          await db.execute('SELECT `User`.id, `User`.stripeKey, `User`.`role` FROM `pricing-tables`.User WHERE id = ?', [token.sub!])
        ).rows[0] as { id: string; stripeKey: string; role: string };

        if (!dbUser) {
          session.user.isSetup = true;
          session.user.role = 'GUEST';
        } else {
          session.user.isSetup = !!dbUser.stripeKey;
          session.user.role = dbUser.role;
        }
        // old safe way
        // session.user.id = user?.id;
        // session.user.isSetup = !!(user as any).stripeKey;
        // session.user.role = (user as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin'
  },
  // to be removed once the guest role is removed
  session: {
    strategy: 'jwt',
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
    // to be removed once the guest role is removed
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '' },
      },
      async authorize() {
        return { id: `guest_${createId()}`, name: 'John Doe', email: 'john.doe@example.com' };
      }
    })
  ],
};

export default NextAuth(authOptions);
