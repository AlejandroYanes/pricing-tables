import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type { Experiment } from '@dealo/models';

import { getStoreItem, updateStore } from 'utils/vercel-edge-config';
import { adminProcedure, createTRPCRouter } from '../trpc';
import initDb from '../../../utils/planet-scale';

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
            SUM(IF(event = 'view', events, 0)) AS views,
            SUM(IF(event = 'signup', events, 0)) AS signups
        FROM (
                 SELECT
                    variant,
                     event,
                     COUNT(*) AS events
                 FROM Analytic
                 GROUP BY variant, event
             ) AS subquery
        GROUP BY variant;`,
        [],
      )
    ).rows as { variant: string; views: number; signups: number }[];

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
