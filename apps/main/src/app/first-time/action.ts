'use server'
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';
import { getServerSession } from 'next-auth';
import { LANDING_PAGE_EXPERIMENT, LANDING_PAGE_EXPERIMENT_COOKIE } from '@dealo/models';

import { recordEvent } from 'utils/analytics';
import { authOptions } from 'utils/auth';

export async function recordSignup() {
  const session = getServerSession(authOptions);

  if (!session) {
    return;
  }

  const sessionCookies = cookies();
  return await recordEvent({
    id: createId(),
    event: 'signup',
    experiment: LANDING_PAGE_EXPERIMENT,
    variant: sessionCookies.get(LANDING_PAGE_EXPERIMENT_COOKIE)?.value,
  });
}
