import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const widgetsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ template: z.string() })).mutation(async ({ ctx, input }) => {
    const widget = await ctx.prisma.priceWidget.create({
      data: {
        templateId: input.template,
        userId: ctx.session.user.id,
      },
    });
    return widget.id;
  }),
});
