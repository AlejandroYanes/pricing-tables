import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type Stripe from 'stripe';

import initDb from 'utils/planet-scale';
import { notifyOfDeletedAccount } from 'utils/slack';
import { sendAccountDeletedEmail } from 'utils/resend';
import { adminProcedure, createTRPCRouter, stripeProcedure } from '../trpc';

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

  deleteAccount: stripeProcedure
    .mutation(async ({ ctx }) => {
      const { session: { user } } = ctx;
      const db = initDb();

      const subscription = (
        await db.execute(`
          SELECT SUB.id, US1.stripeCustomerId, US1.email, US2.stripeAccount
          FROM Subscription SUB
              JOIN User US1 ON SUB.userId = US1.id
              JOIN PriceWidget PW ON SUB.widgetId = PW.id
              JOIN User US2 ON PW.userId = US2.id
          WHERE SUB.status = ? AND US1.id = ?
        `, ['active' as Stripe.Subscription.Status, user.id])
      ).rows[0] as { id?: string; email: string; stripeCustomerId?: string; stripeAccount?: string } | undefined;

      if (!subscription) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No subscription found',
        });
      }

      const { id, email, stripeCustomerId, stripeAccount: checkoutAccount } = subscription;

      if (id) {
        await ctx.stripe.subscriptions.cancel(id, { stripeAccount: checkoutAccount! });
      }

      if (stripeCustomerId) {
        await ctx.stripe.customers.del(stripeCustomerId, { stripeAccount: checkoutAccount! });
      }

      await ctx.stripe.accounts.del(checkoutAccount!);

      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE Subscription SET status = ?, userId = ? WHERE userId = ?',
          ['canceled' as Stripe.Subscription.Status, 'N/A', user.id],
        );
        await tx.execute('UPDATE PriceWidget SET userId = ? WHERE userId = ?', ['N/A', user.id]);
        await tx.execute('DELETE FROM User WHERE id = ?', [user.id]);
        await tx.execute('DELETE FROM Account WHERE id = ?', [user.id]);
        await tx.execute('DELETE FROM Session WHERE id = ?', [user.id]);
      });

      // noinspection ES6MissingAwait
      notifyOfDeletedAccount({ name: user.name!, email, hadSubscription: !!id });
      // noinspection ES6MissingAwait
      sendAccountDeletedEmail({ to: email, name: user.name! })
    }),
});
