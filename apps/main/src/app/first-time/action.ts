'use server'
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';
import { getServerSession } from 'next-auth';
import { LANDING_PAGE_EXPERIMENT, LANDING_PAGE_EXPERIMENT_COOKIE } from '@dealo/models';

import { authOptions } from 'utils/auth';
import { recordEvent } from 'utils/analytics';
import { notifyOfNewSignup } from 'utils/slack';

export async function recordSignup() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return;
  }

  const sessionCookies = cookies();
  try {
    await recordEvent({
      id: createId(),
      event: 'signup',
      experiment: LANDING_PAGE_EXPERIMENT,
      variant: sessionCookies.get(LANDING_PAGE_EXPERIMENT_COOKIE)?.value,
    });
    await notifyOfNewSignup({ name: session.user.name!, email: session.user.email! });
    return { success: true };
  } catch (e) {
    console.error('❌ Failed to record signup event', e);
    return { success: false };
  }
}
