import { z } from 'zod';
import { TRPCError } from '@trpc/server';

import initDb from 'utils/planet-scale';
import { notifyOfDeletedAccount } from 'utils/slack';
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

      const checkoutRecord = (
        await db.execute(`
          SELECT US1.stripeCustomerId, US1.stripeCustomerId, subscriptionId, US2.stripeAccount
          FROM CheckoutRecord CR
              JOIN User US1 ON CR.userId = US1.id
              JOIN PriceWidget PW ON CR.widgetId = PW.id
              JOIN User US2 ON PW.userId = US2.id
          WHERE CR.isActive = true AND US1.id = ?
        `, [user.id])
      ).rows[0] as { stripeCustomerId?: string; stripeAccount?: string; subscriptionId?: string };

      if (!checkoutRecord) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No checkout record found',
        });
      }

      const { stripeCustomerId, subscriptionId, stripeAccount: checkoutAccount } = checkoutRecord;

      if (subscriptionId) {
        await ctx.stripe.subscriptions.cancel(subscriptionId, { stripeAccount: checkoutAccount! });
      }

      if (stripeCustomerId) {
        await ctx.stripe.customers.del(stripeCustomerId, { stripeAccount: checkoutAccount! });
      }

      await ctx.stripe.accounts.del(checkoutAccount!);

      await db.transaction(async (tx) => {
        await tx.execute('UPDATE CheckoutRecord SET isActive = false WHERE userId = ?', [user.id]);
        await tx.execute('DELETE FROM User WHERE id = ?', [user.id]);
      });

      await notifyOfDeletedAccount({ name: user.name!, hadSubscription: !!subscriptionId });
    }),
});
