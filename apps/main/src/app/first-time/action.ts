'use server'
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';
import { LANDING_PAGE_EXPERIMENT, LANDING_PAGE_EXPERIMENT_COOKIE } from '@dealo/models';

import { recordEvent } from 'utils/analytics';

export async function recordSignup() {
  const sessionCookies = cookies();
  return await recordEvent({
    id: createId(),
    event: 'signup',
    experiment: LANDING_PAGE_EXPERIMENT,
    variant: sessionCookies.get(LANDING_PAGE_EXPERIMENT_COOKIE)?.value,
  });
}
