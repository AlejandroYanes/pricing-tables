import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { sql } from '@vercel/postgres';
import type { Experiment } from '@dealo/models';

import { tql } from 'utils/tql';
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
    let dateQuery;

    switch (input) {
      case '24h':
        dateQuery = tql.fragment`CURRENT_DATE - INTERVAL '1 day'`;
        break;
      case '7d':
        dateQuery = tql.fragment`CURRENT_DATE - INTERVAL '7 days'`;
        break;
      case '30d':
        dateQuery = tql.fragment`CURRENT_DATE - INTERVAL '30 days'`;
        break;
    }

    const whereClause = dateQuery ? tql.fragment`WHERE "createdAt" >= ${dateQuery}` : tql.fragment``;
    const [query, parameters] = tql.query`
        SELECT
            "variant",
            SUM(CASE WHEN event = 'view' THEN 1 ELSE 0 END) AS views,
            SUM(CASE WHEN event = 'signup' THEN 1 ELSE 0 END) AS signups,
            COUNT(DISTINCT CASE WHEN event = 'view' THEN "visitorId" END) AS visitors
        FROM "Analytic" ${whereClause}
        GROUP BY "variant"`;

    return (
      await sql.query<{ variant: string; views: number; visitors: number; signups: number }>(query, parameters)
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
