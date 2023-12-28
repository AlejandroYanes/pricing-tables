/* eslint-disable max-len */
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';

import initDb from './planet-scale';

export default function PlanetScaleAdapter(): Adapter {
  const db = initDb();
  return {
    createUser: async (data) => {
      const userId = createId();
      await db.transaction(async (tx) => {
        await tx.execute(
          'INSERT INTO User (id, name, email, image, emailVerified) VALUES (?, ?, ?, ?, ?)',
          [userId, data.name, data.email, data.image, data.emailVerified],
        );
      });
      return (
        await db.execute('SELECT * FROM User WHERE id = ?', [userId])
      ).rows[0] as AdapterUser;
    },
    getUser: async (id) => {
      return (
        await db.execute('SELECT * FROM User WHERE id = ?', [id])
      ).rows[0] as AdapterUser;
    },
    getUserByEmail: async (email) => {
      return (
        await db.execute('SELECT * FROM User WHERE email = ?', [email])
      ).rows[0] as AdapterUser;
    },
    getUserByAccount: async (provider) => {
      return (
        await db.execute(
          'SELECT US.id, US.name, US.email, US.image, US.role FROM User US INNER JOIN Account AC ON US.id = AC.userId WHERE AC.providerAccountId = ? AND AC.provider = ?',
          [provider.providerAccountId, provider.provider],
        )
      ).rows[0] as AdapterUser ?? null;
    },
    updateUser: async ({ id, ...data }) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE User SET name = ?, email = ?, image = ?, emailVerified = ? WHERE id = ?',
          [data.name, data.email, data.image, data.emailVerified, id],
        );
      });
      return (
        await db.execute('SELECT * FROM User WHERE id = ?', [id])
      ).rows[0] as AdapterUser;
    },
    deleteUser: async (id) => {
      await db.transaction(async (tx) => {
        await tx.execute('DELETE FROM User WHERE id = ?', [id])
      });
    },
    linkAccount: async (data) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'INSERT INTO Account (id, type, provider, providerAccountId, userId, refresh_token, access_token, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            createId(),
            data.type,
            data.provider,
            data.providerAccountId,
            data.userId,
            data.refresh_token,
            data.access_token,
            data.expires_at,
          ],
        );
      });
      return (
        await db.execute(
          'SELECT * FROM Account WHERE provider = ? providerAccountId = ?',
          [data.provider, data.providerAccountId],
        )
      ).rows[0] as AdapterAccount;
    },
    unlinkAccount: async (data) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'DELETE FROM Account WHERE provider = ? AND providerAccountId = ?',
          [data.provider, data.providerAccountId],
        );
      });
    },
    getSessionAndUser: async (sessionToken) => {
      const userAndSession = (
        await db.execute(
          `
            SELECT US.id, US.name, US.email, US.image, US.emailVerified, US.role, US.stripeConnected, US.stripeKey, US.stripeCustomerId, SE.userId, SE.expires, SE.sessionToken
            FROM User US
              INNER JOIN Session SE ON US.id = SE.userId
            WHERE SE.sessionToken = ?
          `,
          [sessionToken],
        )
      ).rows[0] as {
        id: string;
        name: string;
        email: string | null;
        emailVerified: string | null;
        image: string | null;
        role: string;
        stripeConnected: boolean;
        stripeKey: string | null;
        stripeCustomerId: string | null;
        userId: string;
        expires: string;
        sessionToken: string;
      } | null;

      if (!userAndSession) return null;

      const checkoutRecord = (
        await db.execute(
          'SELECT subscriptionId, isActive, currentPeriodEnd, cancelAt FROM CheckoutRecord WHERE userId = ? ORDER BY createdAt DESC LIMIT 1',
          [userAndSession.userId],
        )
      ).rows[0] as {
        subscriptionId: string;
        isActive: boolean;
        currentPeriodEnd: number;
        cancelAt: number;
      } | undefined;

      const { id, name, email, emailVerified, image, role, stripeConnected, stripeKey, stripeCustomerId, userId, expires } = userAndSession;
      return {
        user: {
          id,
          name,
          email,
          image,
          role,
          emailVerified,
          stripeCustomerId,
          isSetup: stripeConnected,
          hasLegacySetup: !!stripeKey,
          hasSubscription: !!checkoutRecord?.subscriptionId && checkoutRecord.isActive,
          subscriptionEndsAt: checkoutRecord?.currentPeriodEnd,
          subscriptionCancelAt: checkoutRecord?.cancelAt,
        } as AdapterUser,
        session: { sessionToken, userId, expires: new Date(expires) } as AdapterSession,
      };
    },
    createSession: async (data) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'INSERT INTO Session (id, sessionToken, userId, expires) VALUES (?, ?, ?, ?)',
          [createId(), data.sessionToken, data.userId, data.expires],
        );
      });
      const session =  (
        await db.execute(
          'SELECT * FROM Session WHERE sessionToken = ?',
          [data.sessionToken],
        )
      ).rows[0] as AdapterSession;

      return { ...session, expires: new Date(session.expires) };
    },
    updateSession: async (data) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE Session SET expires = ?, userId = ? WHERE sessionToken = ?',
          [data.expires, data.userId, data.sessionToken],
        );
      });
      const session =  (
        await db.execute(
          'SELECT * FROM Session WHERE sessionToken = ?',
          [data.sessionToken],
        )
      ).rows[0] as AdapterSession;

      return { ...session, expires: new Date(session.expires) };
    },
    deleteSession: async (sessionToken) => {
      const session =  (
        await db.execute(
          'SELECT * FROM Session WHERE sessionToken = ?',
          [sessionToken],
        )
      ).rows[0] as AdapterSession;

      await db.transaction(async (tx) => {
        await tx.execute('DELETE FROM Session WHERE sessionToken = ?', [
          sessionToken,
        ])
      });

      return { ...session, expires: new Date(session.expires) };
    },
    createVerificationToken: async (data) => {
      await db.transaction(async (tx) => {
        await tx.execute(
          'INSERT INTO VerificationToken (token, identifier, expires) VALUES (?, ?, ?)',
          [data.token, data.identifier, data.expires],
        );
      });
      return (
        await db.execute(
          'SELECT * FROM VerificationToken WHERE token = ? AND identifier = ?',
          [data.token, data.identifier],
        )
      ).rows[0] as any;
    },
    useVerificationToken: async (data) => {
      const verificationToken = (
        await db.execute(
          'SELECT token, identifier, expires FROM VerificationToken WHERE token = ? AND identifier = ?',
          [data.token, data.identifier],
        )
      ).rows[0] as { token: string; identifier: string; expires: Date } | undefined;

      if (!verificationToken) return null;

      await db.transaction(async (tx) => {
        await tx.execute(
          'DELETE FROM VerificationToken WHERE token = ? AND identifier = ?',
          [data.token, data.identifier],
        );
      });

      return verificationToken;
    },
  }
}
