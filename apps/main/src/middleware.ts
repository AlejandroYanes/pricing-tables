import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as edgeConfig from '@vercel/edge-config';
import { pickRandomIndexWithDistribution } from '@dealo/helpers';
import type { Experiment } from '@dealo/models';

import { updateStore } from 'utils/vercel-edge-config';
import { isProductionServer } from './utils/environments';

export const config = {
  matcher: ['/'],
}

function getNewVariant(experiment: Experiment) {
  const { variants, distribution } = experiment;
  const flatDistributions = variants.map((variant) => distribution[variant]!);
  const index = pickRandomIndexWithDistribution(flatDistributions);
  return variants[index]!;
}

export async function middleware(req: NextRequest) {
  const edgeConfigNode = await edgeConfig.get('landing_page');
  if (edgeConfigNode) {
    const experiment = edgeConfigNode as unknown as Experiment;
    const { results, running } = experiment;

    if (!running) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get('dealo_x_landing_page');
    const variant = cookie?.value || getNewVariant(experiment);

    if (variant && isProductionServer()) {
      await updateStore([
        {
          operation: 'update',
          key: 'landing_page',
          value: {
            ...experiment,
            results: {
              ...results,
              [variant]: {
                visits: (results[variant]?.visits || 0) + 1,
                signups: (results[variant]?.signups || 0),
              },
            },
          },
        }
      ]);

      const url = req.nextUrl.clone();

      if (variant !== 'default') {
        url.pathname = `/x/${variant}`;
      }

      const res = NextResponse.rewrite(url);

      if (!cookie) {
        res.cookies.set('dealo_x_landing_page', variant, {
          sameSite: 'strict',
        });
      }

      return res;
    }
  }
}
