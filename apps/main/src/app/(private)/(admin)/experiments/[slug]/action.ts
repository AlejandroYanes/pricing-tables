'use server'
import { revalidateTag } from 'next/cache';
import type { Experiment } from '@dealo/models';

import { updateStore } from 'utils/vercel-edge-config';

export async function updateDistributions(slug: string, experiment: Experiment, newDistribution: Experiment['distribution']) {
  await updateStore([
    {
      operation: 'update',
      key: 'landing_page',
      value: {
        ...experiment,
        distribution: newDistribution,
      },
    }
  ]);
  revalidateTag(`experiment/slug/${slug}`);
}
