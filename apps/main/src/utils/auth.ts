import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { env } from 'env/server.mjs';
import PlanetScaleAdapter from './planet-scale-adapter';

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Include user.id on session
    async session({ session, user }) {
      if (session.user) {
        session.user = user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    newUser: '/first-time?signup=true',
  },
  adapter: PlanetScaleAdapter(),
  // Configure one or more authentication providers
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
