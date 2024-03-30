import type { NextApiRequest, NextApiResponse } from 'next';
import { type AuthenticatedSession } from 'next-auth';
import { sql } from '@vercel/postgres';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import { authMiddleware } from 'utils/api';
import initStripe from 'utils/stripe';

async function handler(_: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) {
  const stripe = initStripe();
  const client = await sql.connect();

  const platformUrl = process.env.PLATFORM_URL ?? env.NEXTAUTH_URL;

  const { stripeAccount, stripeConnected } = (
    await client.sql`SELECT "stripeAccount", "stripeConnected" FROM "User" WHERE id = ${session.user.id}`
  ).rows[0] as { stripeAccount: string; stripeConnected: boolean };

  if (!stripeAccount) {
    const newAccount = await stripe.accounts.create({
      type: 'standard',
    });

    await client.sql`UPDATE "User" SET "stripeAccount" = ${newAccount.id} WHERE id = ${session.user.id}`;

    client.release();

    const accountLinkUrl = await generateStripeAccountLink(stripe, newAccount.id, platformUrl);
    res.redirect(303, accountLinkUrl);
    return;
  }

  if (stripeConnected) {
    client.release();
    res.redirect(303, `${platformUrl}/dashboard`);
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    await client.sql`UPDATE "User" SET "stripeConnected" = true, stripeKey = null WHERE id = ${session.user.id}`;

    client.release();
    res.redirect(303, `${platformUrl}/dashboard`);
    return;
  }

  client.release();

  const accountLinkUrl = await generateStripeAccountLink(stripe, stripeAccount, platformUrl);
  res.redirect(303, accountLinkUrl);
}

export default authMiddleware(handler);

const generateStripeAccountLink = async (stripe: Stripe, accountId: string, platformUrl: string) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${platformUrl}/api/stripe/connect/start`,
    return_url: `${platformUrl}/stripe/connect/return`,
    type: 'account_onboarding',
  });

  return accountLink.url;
};
