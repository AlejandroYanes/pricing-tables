import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type { Experiment } from '@dealo/models';

import { getStoreItem, updateStore } from 'utils/vercel-edge-config';
import initDb from 'utils/planet-scale';
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

    const db = initDb();

    const results = (
      await db.execute(
        `SELECT
            variant,
            SUM(IF(event = 'view', 1, 0)) AS views,
            SUM(IF(event = 'signup', 1, 0)) AS signups,
            COUNT(DISTINCT CASE WHEN event = 'view' THEN visitorId END) AS visitors
        FROM Analytic
        GROUP BY variant;`,
        [],
      )
    ).rows as { variant: string; views: number; visitors: number; signups: number }[];

    return { experiment, results };
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
