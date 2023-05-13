import { z } from 'zod';
import { ITEMS_PER_PAGE_LIMIT } from 'helpers';
import { ROLES_LIST } from 'models';

import { notifyOfDeletedAccount, notifyOfNewSetup } from 'utils/slack';
import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  setup: protectedProcedure.input(z.string()).mutation(async ({ input: apiKey, ctx }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        stripeKey: apiKey,
      },
    });
    notifyOfNewSetup({ name: ctx.session.user.name! });
  }),

  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1),
      query: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, query } = input;

      const whereQuery = query ? {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      } : undefined;
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

      const results = await ctx.prisma.user.findMany({
        take: ITEMS_PER_PAGE_LIMIT,
        skip: page === 1 ? 0 : ITEMS_PER_PAGE_LIMIT * (page - 1),
        where: whereQuery,
        select: selectQuery,
      });
      const count = await ctx.prisma.user.count({
        where: whereQuery,
      });
      return { results, count };
    }),

  updateRole: adminProcedure.input(z.object({ userId: z.string(), newRole: z.enum(['FAKE', ...(ROLES_LIST as string[])]) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          role: input.newRole,
        },
      });
    }),

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { session: { user } } = ctx;
      await ctx.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      notifyOfDeletedAccount({ name: user.name! });
    })
});
