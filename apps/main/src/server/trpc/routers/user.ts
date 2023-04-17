import { z } from 'zod';

import { notifyOfDeletedAccount, notifyOfNewSetup } from 'utils/slack';
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
    notifyOfNewSetup({ name: ctx.session.user.name! });
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
