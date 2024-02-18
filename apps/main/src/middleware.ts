import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as edgeConfig from '@vercel/edge-config';
import { createId } from '@paralleldrive/cuid2';
import { pickRandomIndexWithDistribution } from '@dealo/helpers';
import { type Experiment, LANDING_PAGE_EXPERIMENT, LANDING_PAGE_EXPERIMENT_COOKIE, VISITOR_ID_COOKIE } from '@dealo/models';

import { isNotStableServer } from 'utils/environments';
import { recordEvent } from 'utils/analytics';

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
  const edgeConfigNode = await edgeConfig.get(LANDING_PAGE_EXPERIMENT);
  if (edgeConfigNode) {
    const experiment = edgeConfigNode as unknown as Experiment;
    const { running } = experiment;

    if (!running) {
      return NextResponse.next();
    }

    const visitorCookie = req.cookies.get(VISITOR_ID_COOKIE);
    const visitorId = visitorCookie?.value || createId();

    const variantCookie = req.cookies.get(LANDING_PAGE_EXPERIMENT_COOKIE);
    const variant = variantCookie?.value || getNewVariant(experiment);

    if (variant) {
      await recordEvent({
        id: createId(),
        experiment: LANDING_PAGE_EXPERIMENT,
        variant,
        event: 'view',
        visitorId,
        country: req.geo?.country,
        region: req.geo?.region,
      });

      const url = req.nextUrl.clone();

      if (variant !== 'default') {
        url.pathname = `/x/${variant}`;
      }

      const res = NextResponse.rewrite(url);

      if (!variantCookie) {
        res.cookies.set(LANDING_PAGE_EXPERIMENT_COOKIE, variant, {
          sameSite: 'strict',
        });
      }

      if (!visitorCookie) {
        res.cookies.set(VISITOR_ID_COOKIE, visitorId, {
          sameSite: 'strict',
        });
      }

      return res;
    }
  }
}
