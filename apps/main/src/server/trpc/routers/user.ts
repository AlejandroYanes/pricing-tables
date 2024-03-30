import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { sql } from '@vercel/postgres';
import { ROLES } from '@dealo/models';

import { env } from 'env/server.mjs';
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
      status: z.enum(['setup', 'legacy', 'none', 'all']),
    }))
    .query(async ({ ctx, input }) => {
      const { page, pageSize, query, status } = input;

      let setupQuery = {};
      let searchQuery = {};

      switch (status) {
        case 'setup':
          setupQuery = { stripeConnected: true };
          break;
        case 'legacy':
          setupQuery = { stripeKey: { not: null } };
          break;
        case 'none':
          setupQuery = { stripeConnected: false, stripeKey: null };
          break;
        default:
          break;
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
        createdAt: true,
        _count: {
          select: {
            widgets: true,
          },
        },
      };

      const results = (await ctx.prisma.user.findMany({
        orderBy: [
          { createdAt: 'asc' },
          { id: 'asc' },
        ],
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

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { session: { user } } = ctx;

      const stripe = initStripe();
      const client = await sql.connect();

      const dbUser = (
        await client.sql<{ email: string; stripeAccount?: string; role: string }>`
          SELECT email, "stripeAccount", role FROM "User" WHERE id = ${user.id}`
      ).rows[0];

      if (!dbUser) {
        client.release();
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      if (dbUser.role === ROLES.ADMIN) {
        console.log('user is an admin and cannot be deleted');
        client.release();
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Admin accounts cannot be deleted',
        });
      }

      try {
        const subscription = (
          await sql<{ id: string }>`SELECT id FROM "Subscription" WHERE "userId" = ${user.id} AND status = 'active' LIMIT 1`
        ).rows[0];

        if (subscription) {
          await stripe.subscriptions.cancel(subscription.id, { stripeAccount: env.STRIPE_DEALO_ACCOUNT });
        }

        // the second check is to prevent deleting the billing stripe account
        if (dbUser.stripeAccount && dbUser.stripeAccount !== env.STRIPE_DEALO_ACCOUNT) {
          await stripe.accounts.del(dbUser.stripeAccount);
        }

        await client.sql`UPDATE "Subscription" SET status = 'canceled' WHERE "userId" = ${user.id}`;
        await client.query(
          `UPDATE "User" SET "isActive" = FALSE, "updatedAt" = NOW(), email = $1 WHERE id = $2`,
          [`deleted-${user.email}-${user.id}`, user.id],
        );
        await client.sql`DELETE FROM "Account" WHERE "userId" = ${user.id}`;
        await client.sql`DELETE FROM "Session" WHERE "userId" = ${user.id}`;

        const widgets = (
          await client.sql<{ id: string }>`SELECT id FROM "PriceWidget" WHERE "userId" = ${user.id}`
        ).rows;

        const widgetIds = widgets.map((w) => w.id);

        if (widgetIds.length) {
          const widgetIdsStr = `${widgetIds.map((_, i) => `$${i + 1}`).join(',')}`;
          await client.query(`DELETE FROM "PriceWidget" WHERE id IN (${widgetIdsStr})`, [...widgetIds]);
          await client.query(`DELETE FROM "Product" WHERE "widgetId" IN (${widgetIdsStr})`, [...widgetIds]);
          await client.query(`DELETE FROM "Price" WHERE "widgetId" IN (${widgetIdsStr})`, [...widgetIds]);
          await client.query(`DELETE FROM "Feature" WHERE "widgetId" IN (${widgetIdsStr})`, [...widgetIds]);
          await client.query(`DELETE FROM "Callback" WHERE "widgetId" IN (${widgetIdsStr})`, [...widgetIds]);
        }

        client.release();

        await notifyOfDeletedAccount({ name: user.name!, email: dbUser.email, hadSubscription: !!subscription });
        await sendAccountDeletedEmail({ to: dbUser.email, name: user.name! });
      } catch (e: any) {
        console.error('❌ Error deleting account', e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error deleting account',
        });
      }
    }),
});
