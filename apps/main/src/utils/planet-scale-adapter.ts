/* eslint-disable max-len */
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from 'next-auth/adapters';
import { sql } from '@vercel/postgres';
import { createId } from '@paralleldrive/cuid2';
import type Stripe from 'stripe';

export default function PlanetScaleAdapter(): Adapter {
  return {
    createUser: async (data) => {
      const userId = createId();
      const client = await sql.connect();

      await client.sql`
        INSERT INTO "User" (id, name, email, image, "emailVerified")
        VALUES (${userId}, ${data.name}, ${data.email}, ${data.image}, ${data.emailVerified ? data.emailVerified.toDateString() : null})`;

      const user = await client.sql`SELECT id, email, "emailVerified", name, image, role FROM "User" WHERE id = ${userId}`;

      client.release();
      return user.rows[0] as AdapterUser;
    },
    getUser: async (id) => {
      return (
        await sql`SELECT id, email, "emailVerified", name, image, role FROM "User" WHERE id = ${id}`
      ).rows[0] as AdapterUser;
    },
    getUserByEmail: async (email) => {
      return (
        await sql`SELECT id, email, "emailVerified", name, image, role FROM "User" WHERE email = ${email}`
      ).rows[0] as AdapterUser;
    },
    getUserByAccount: async (provider) => {
      return (
        await sql`
          SELECT US.id, US.name, US.email, US.image, US.role
          FROM "User" US INNER JOIN "Account" AC ON US.id = AC."userId"
          WHERE AC."providerAccountId" = ${provider.providerAccountId} AND AC.provider = ${provider.provider}`
      ).rows[0] as AdapterUser ?? null;
    },
    updateUser: async ({ id, ...data }) => {
      const client = await sql.connect();

      await client.sql`
        UPDATE "User" SET
          name = ${data.name},
          email = ${data.email},
          image = ${data.image},
          "emailVerified" = ${data.emailVerified ? data.emailVerified.toDateString() : null}
        WHERE id = ${id}`;
      const user = await client.sql`SELECT id, email, "emailVerified", name, image, role FROM "User" WHERE id = ${id}`;

      client.release();
      return user.rows[0] as AdapterUser;
    },
    deleteUser: async (id) => {
      await sql`DELETE FROM User WHERE id = ${id}`;
    },
    linkAccount: async (data) => {
      const client = await sql.connect();

      await client.sql`
        INSERT INTO "Account" (id, type, provider, "providerAccountId", "userId", refresh_token, access_token, expires_at)
        VALUES (${createId()}, ${data.type}, ${data.provider}, ${data.providerAccountId}, ${data.userId}, ${data.refresh_token}, ${data.access_token}, ${data.expires_at})`;

      const user = await client.sql`SELECT * FROM "Account" WHERE provider = ${data.provider} AND "providerAccountId" = ${data.providerAccountId}`;

      client.release();
      return user.rows[0] as AdapterAccount;
    },
    unlinkAccount: async (data) => {
      await sql`DELETE FROM "Account" WHERE provider = ${data.provider} AND "providerAccountId" = ${data.providerAccountId}`;
    },
    getSessionAndUser: async (sessionToken) => {
      const client = await sql.connect();

      const sessionQuery = await client.sql`
        SELECT US.id, US.name, US.email, US.image, US."emailVerified", US.role, US."stripeConnected", US."stripeKey", US."stripeCustomerId", SE."userId", SE.expires, SE."sessionToken"
        FROM "User" US
          INNER JOIN "Session" SE ON US.id = SE."userId"
        WHERE SE."sessionToken" = ${sessionToken} AND US."isActive" = TRUE`;

      const userAndSession = sessionQuery.rows[0] as {
        id: string;
        name: string;
        email: string | null;
        emailVerified: string | null;
        image: string | null;
        role: string;
        stripeConnected: number;
        stripeKey: string | null;
        stripeCustomerId: string | null;
        userId: string;
        expires: string;
        sessionToken: string;
      } | null;

      if (!userAndSession) {
        client.release();
        return null;
      }

      const subscriptionQuery = await client.sql`
        SELECT id, status, "trialEnd", "cancelAt"
        FROM "Subscription"
        WHERE "userId" = ${userAndSession.userId} ORDER BY "createdAt" DESC LIMIT 1`;

      const subscription = subscriptionQuery.rows[0] as {
        id: string;
        status: Stripe.Subscription.Status;
        trialEnd: number;
        cancelAt: number;
      } | undefined;

      client.release();

      const {
        id,
        name,
        email,
        emailVerified,
        image,
        role,
        stripeConnected,
        stripeKey,
        stripeCustomerId,
        userId,
        expires,
      } = userAndSession;
      return {
        user: {
          id,
          name,
          email,
          image,
          role,
          emailVerified,
          stripeCustomerId,
          isSetup: !!stripeConnected,
          hasLegacySetup: !!stripeKey,
          subscriptionStatus: subscription?.status ?? null,
          trialEnd: subscription?.trialEnd ?? null,
          subscriptionCancelAt: subscription?.cancelAt ?? null,
        } as AdapterUser,
        session: { sessionToken, userId, expires: new Date(expires) } as AdapterSession,
      };
    },
    createSession: async (data) => {
      const client = await sql.connect();

      await client.sql`
        INSERT INTO "Session" (id, "sessionToken", "userId", expires)
        VALUES (${createId()}, ${data.sessionToken}, ${data.userId}, ${data.expires.toDateString()})`;
      const sessionQuery = await client.sql`SELECT * FROM "Session" WHERE "sessionToken" = ${data.sessionToken}`;
      const session =  sessionQuery.rows[0] as AdapterSession;

      client.release();
      return { ...session, expires: new Date(session.expires) };
    },
    updateSession: async (data) => {
      const client = await sql.connect();

      await client.sql`
        UPDATE "Session" SET expires = ${data.expires ? data.expires.toString() : null}
        WHERE "sessionToken" = ${data.sessionToken}`;
      const sessionQuery = await client.sql`SELECT * FROM "Session" WHERE "sessionToken" = ${data.sessionToken}`;
      const session =  sessionQuery.rows[0] as AdapterSession;

      client.release();
      return { ...session, expires: new Date(session.expires) };
    },
    deleteSession: async (sessionToken) => {
      const client = await sql.connect();
      const sessionQuery = await client.sql`SELECT * FROM "Session" WHERE "sessionToken" = ${sessionToken}`;
      const session =  sessionQuery.rows[0] as AdapterSession;

      await client.sql`DELETE FROM "Session" WHERE "sessionToken" = ${sessionToken}`;

      return session ? { ...session, expires: new Date(session.expires) } : undefined;
    },
    createVerificationToken: async (data) => {
      const client = await sql.connect();

      await client.sql`
        INSERT INTO "VerificationToken" (id, token, identifier, expires)
        VALUES (${createId()}, ${data.token}, ${data.identifier}, ${data.expires.toDateString()})`;
      const verificationTokenQuery = await client.sql`
        SELECT * FROM "VerificationToken"
        WHERE token = ${data.token} AND identifier = ${data.identifier}`;

      client.release();
      return verificationTokenQuery.rows[0] as any;
    },
    useVerificationToken: async (data) => {
      const client = await sql.connect();
      const verificationToken = (
        await client.sql<{ token: string; identifier: string; expires: Date }>`
          SELECT token, identifier, expires FROM "VerificationToken"
          WHERE token = ${data.token} AND identifier = ${data.identifier}`
      ).rows[0];

      if (!verificationToken) {
        client.release();
        return null;
      }

      await client.sql`DELETE FROM "VerificationToken" WHERE token = ${data.token} AND identifier = ${data.identifier}`;

      return verificationToken;
    },
  }
}
