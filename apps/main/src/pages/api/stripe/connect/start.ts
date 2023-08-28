import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { env } from 'env/server.mjs';
import { authMiddleware } from 'utils/api';
import initStripe from 'utils/stripe';
import { authOptions } from '../../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions))!;

  if (!session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const stripe = initStripe(env.STRIPE_SECRET_KEY);

  const account = await stripe.accounts.create({
    type: 'standard',
  });

  const platformUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXTAUTH_URL;
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${platformUrl}/api/stripe/connect/start`,
    return_url: `${platformUrl}/stripe/connect/return`,
    type: 'account_onboarding',
  });

  res.redirect(303, accountLink.url);
}

export default authMiddleware(handler);
