import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { sql } from '@vercel/postgres';
import type { Experiment } from '@dealo/models';

import { getStoreItem, updateStore } from 'utils/vercel-edge-config';
import { adminProcedure, createTRPCRouter } from '../trpc';

export const experimentsRouter = createTRPCRouter({
  getExperiment: adminProcedure.input(z.string()).query(async ({ input }) => {
    const experiment = await getStoreItem<Experiment>(input);

    if (!experiment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Experiment not found',
      });
    }

    return experiment;
  }),

  getRecords: adminProcedure.input(z.enum(['24h', '7d', '30d', 'all'])).query(async ({ input }) => {
    let dateQuery = '';

    switch (input) {
      case '24h':
        dateQuery = 'DATE_SUB(NOW(), INTERVAL 1 DAY)';
        break;
      case '7d':
        dateQuery = 'DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30d':
        dateQuery = 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
    }

    return (
      await sql<{ variant: string; views: number; visitors: number; signups: number }>`
      SELECT
            "variant",
            SUM(CASE WHEN event = 'view' THEN 1 ELSE 0 END) AS views,
            SUM(CASE WHEN event = 'signup' THEN 1 ELSE 0 END) AS signups,
            COUNT(DISTINCT CASE WHEN event = 'view' THEN "visitorId" END) AS visitors
        FROM "Analytic" WHERE "createdAt" > ${dateQuery}
        GROUP BY "variant"`
    ).rows;
  }),

  updateDistributions: adminProcedure.input(z.object({
    slug: z.string(),
    experiment: z.any(),
    newDistribution: z.record(z.number()),
  })).mutation(async ({ input }) => {
    const { slug, experiment, newDistribution } = input;
    await updateStore([
      {
        operation: 'update',
        key: slug,
        value: {
          ...experiment,
          distribution: newDistribution,
        },
      }
    ]);
  }),

  updateStatus: adminProcedure.input(z.object({
    slug: z.string(),
    experiment: z.any(),
    running: z.boolean(),
  })).mutation(async ({ input }) => {
    const { slug, experiment, running } = input;
    await updateStore([
      {
        operation: 'update',
        key: slug,
        value: {
          ...experiment,
          running,
        },
      }
    ]);
  }),
});
