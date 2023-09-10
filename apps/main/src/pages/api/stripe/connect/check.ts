import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { env } from 'env/server.mjs';
import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions))!;

  if (!session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const stripe = initStripe(env.STRIPE_SECRET_KEY);
  const db = initDb();

  const { stripeAccount } = (
    await db.execute('SELECT stripeAccount FROM `pricing-tables`.`User` WHERE `id` = ?', [session.user.id])
  ).rows[0] as { stripeAccount: string };

  if (!stripeAccount) {
    res.status(200).json({ connected: false });
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    await db.transaction(async (tx) => {
      // eslint-disable-next-line max-len
      await tx.execute('UPDATE `pricing-tables`.`User` SET `stripeConnected` = true, `stripeKey` = null WHERE `id` = ?', [session.user!.id]);
    });

    res.status(200).json({ connected: true });
    return;
  }

  res.status(200).json({ connected: false });
}
