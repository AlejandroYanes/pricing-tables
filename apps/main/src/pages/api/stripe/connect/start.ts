import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import { authMiddleware } from 'utils/api';
import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';
import { authOptions } from '../../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions))!;

  if (!session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const stripe = initStripe();
  const db = initDb();
  const platformUrl = process.env.PLATFORM_URL ?? env.NEXTAUTH_URL;

  const { stripeAccount, stripeConnected } = (
    await db.execute('SELECT stripeAccount, stripeConnected FROM `pricing-tables`.`User` WHERE `id` = ?', [session.user.id])
  ).rows[0] as { stripeAccount: string; stripeConnected: boolean };

  if (!stripeAccount) {
    const newAccount = await stripe.accounts.create({
      type: 'standard',
    });

    await db.transaction(async (tx) => {
      await tx.execute( 'UPDATE `pricing-tables`.`User` SET `stripeAccount` = ? WHERE `id` = ?', [newAccount.id, session.user!.id]);
    });

    const accountLinkUrl = await generateStripeAccountLink(stripe, newAccount.id, platformUrl);
    res.redirect(303, accountLinkUrl);
    return;
  }

  if (stripeConnected) {
    res.redirect(303, `${platformUrl}/stripe/connect/return`);
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    res.redirect(303, `${platformUrl}/stripe/connect/return`);
    return;
  }

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
