import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import type { AuthenticatedSession } from 'next-auth';
import type Stripe from 'stripe';

import initStripe from 'utils/stripe';
import { notifyOfNewSetup } from 'utils/slack';
import { sendWelcomeEmail } from 'utils/resend';
import { authMiddleware } from 'utils/api';

async function handler(_: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) {

  const stripe = initStripe();
  const client = await sql.connect();

  const { stripeAccount, stripeConnected } = (
    await client.sql`SELECT "stripeAccount", "stripeConnected" FROM "User" WHERE id = ${session.user.id}`
  ).rows[0] as { stripeAccount: string; stripeConnected: boolean };

  if (!stripeAccount) {
    client.release();
    res.status(200).json({ connected: false });
    return;
  }

  if (stripeConnected) {
    client.release();
    res.status(200).json({ connected: true });
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    const checkoutRecord = (
      await client.sql<{ id: string; status: Stripe.Subscription.Status; trialEnd: number }>`
        SELECT id, status, "trialEnd"
        FROM "Subscription"
        WHERE "userId" = ${session.user.id} ORDER BY "createdAt" DESC LIMIT 1`
    ).rows[0];

    await sql`UPDATE "User" SET "stripeConnected" = true, "stripeKey" = null WHERE id = ${session.user.id}`;

    client.release();

    await notifyOfNewSetup({
      name: session.user.name!,
      email: session.user.email!,
      hasSubscription: checkoutRecord?.status === 'active',
      hasTrial: checkoutRecord?.status === 'trialing',
      trialEndsAt: checkoutRecord?.trialEnd,
    });
    await sendWelcomeEmail({
      to: session.user.email!,
      name: session.user.name!,
      withSubscription: checkoutRecord?.status === 'active',
      withTrial: checkoutRecord?.status === 'trialing',
      trialEndsAt: checkoutRecord?.trialEnd,
    });

    res.status(200).json({ connected: true });
    return;
  }

  client.release();
  res.status(200).json({ connected: false });
}

export default authMiddleware(handler);
