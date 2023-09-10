import { z } from 'zod';

import { notifyOfDeletedAccount } from 'utils/slack';
import { adminProcedure, createTRPCRouter, stripeProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1),
      pageSize: z.number(),
      query: z.string().nullish(),
      isSetup: z.enum(['all', 'yes', 'no']),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, query, isSetup } = input;

      let setupQuery = {};
      let searchQuery = {};

      if (isSetup === 'yes') {
        setupQuery = {
          stripeKey: { not: null },
        };
      } else if (isSetup === 'no') {
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
        isSetup: !!res.stripeKey,
      }));
      const count = await ctx.prisma.user.count({
        where: whereQuery,
      });
      return { results, count };
    }),

  deleteAccount: stripeProcedure
    .mutation(async ({ ctx }) => {
      const { session: { user } } = ctx;
      const { stripeAccount } = (await ctx.prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          stripeAccount: true,
        },
      }))!;
      await ctx.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      await ctx.stripe.accounts.del(stripeAccount!);
      await notifyOfDeletedAccount({ name: user.name! });
    }),
});
