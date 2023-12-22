import { z } from 'zod';

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
      const { stripeAccount, stripeCustomerId, stripeSubscriptionId } = (await ctx.prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          stripeAccount: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      }))!;

      await ctx.prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      await ctx.stripe.accounts.del(stripeAccount!);

      if (stripeCustomerId) {
        await ctx.stripe.customers.del(stripeCustomerId);
      }

      if (stripeSubscriptionId) {
        await ctx.stripe.subscriptions.del(stripeSubscriptionId);
      }

      await notifyOfDeletedAccount({ name: user.name!, hadSubscription: !!stripeSubscriptionId });
    }),
});
