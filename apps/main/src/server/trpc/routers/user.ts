import { z } from 'zod';
import type Stripe from 'stripe';
import { TRPCError } from '@trpc/server';

import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfDeletedAccount } from 'utils/slack';
import { sendAccountDeletedEmail } from 'utils/resend';
import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1),
      pageSize: z.number(),
      query: z.string().nullish(),
      isSetup: z.enum(['yes', 'no']).nullish(),
      hasLegacy: z.enum(['yes', 'no']).nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, query, isSetup, hasLegacy } = input;

      let setupQuery = {};
      let searchQuery = {};

      if (isSetup === 'yes') {
        setupQuery = {
          stripeConnected: true,
        };
      } else if (isSetup === 'no') {
        setupQuery = {
          stripeConnected: false,
        };
      }

      if (hasLegacy === 'yes') {
        setupQuery = {
          stripeKey: { not: null },
        };
      } else if (hasLegacy === 'no') {
        setupQuery = {
          stripeKey: null,
        };
      }

      if (query) {
        searchQuery = {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
          ],
        };
      }

      const whereQuery = {
        ...setupQuery,
        ...searchQuery,
      };
      const selectQuery = {
        id: true,
        name: true,
        email: true,
        image: true,
        stripeKey: true,
        stripeConnected: true,
        _count: {
          select: {
            widgets: true,
          },
        },
      };

      const results = (await ctx.prisma.user.findMany({
        take: pageSize,
        skip: page === 1 ? 0 : pageSize * (page - 1),
        where: whereQuery,
        select: selectQuery,
        orderBy: {
          createdAt: 'asc',
        }
      })).map((res) => ({
        ...res,
        stripeKey: undefined,
        isSetup: !!res.stripeConnected,
        hasLegacy: !!res.stripeKey,
      }));
      const count = await ctx.prisma.user.count({
        where: whereQuery,
      });
      return { results, count };
    }),

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        const { session: { user } } = ctx;
        const db = initDb();
        const stripe = initStripe();

        const dbUser = (
          await db.execute('SELECT email, stripeAccount FROM User WHERE id = ?', [user.id])
        ).rows[0] as { email: string; stripeAccount?: string } | undefined;

        if (!dbUser) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error('DB_USER_NOT_FOUND');
        }

        const subscription = (
          await db.execute(`
          SELECT id
          FROM Subscription
          WHERE Subscription.userId = ? ORDER BY Subscription.createdAt DESC LIMIT 1
        `, ['active' as Stripe.Subscription.Status, user.id])
        ).rows[0] as { id: string } | undefined;

        if (subscription) {
          await stripe.subscriptions.cancel(subscription.id, { stripeAccount: env.STRIPE_DEALO_ACCOUNT });
        }

        // the second check is to prevent deleting the billing stripe account
        if (dbUser.stripeAccount && dbUser.stripeAccount !== env.STRIPE_DEALO_ACCOUNT) {
          await stripe.accounts.del(dbUser.stripeAccount);
        }

        await db.transaction(async (tx) => {
          await tx.execute(
            'UPDATE Subscription SET status = ? WHERE userId = ?',
            ['canceled' as Stripe.Subscription.Status, user.id],
          );
          await tx.execute(
            'UPDATE User SET isActive = FALSE, updatedAt = NOW(), email = ? WHERE id = ?',
            [`deleted-${user.email}-${user.id}`, user.id],
          );
          await tx.execute('DELETE FROM Account WHERE userId = ?', [user.id]);
          await tx.execute('DELETE FROM Session WHERE userId = ?', [user.id]);

          const widgets = (
            await tx.execute('SELECT id FROM PriceWidget WHERE userId = ?', [ user.id])
          ).rows as { id: string }[];

          const widgetIds = widgets.map((w) => w.id);

          if (widgetIds.length) {
            await tx.execute('DELETE FROM PriceWidget WHERE id IN (?)', [widgetIds]);
            await tx.execute('DELETE FROM Product WHERE widgetId IN (?)', [widgetIds]);
            await tx.execute('DELETE FROM Price WHERE widgetId IN (?)', [widgetIds]);
            await tx.execute('DELETE FROM Feature WHERE widgetId IN (?)', [widgetIds]);
            await tx.execute('DELETE FROM Callback WHERE widgetId IN (?)', [widgetIds]);
          }
        });

        await notifyOfDeletedAccount({ name: user.name!, email: dbUser.email, hadSubscription: !!subscription });
        await sendAccountDeletedEmail({ to: dbUser.email, name: user.name! });
      } catch (e: any) {
        console.error('Error deleting account', e);

        if (e.message === 'DB_USER_NOT_FOUND') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error deleting account',
        });
      }
    }),
});
