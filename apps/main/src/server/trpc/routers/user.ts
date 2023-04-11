import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

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
  }),
  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { session: { user } } = ctx;
      return ctx.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
    })
});
