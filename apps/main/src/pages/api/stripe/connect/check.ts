import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';
import { notifyOfNewSetup } from 'utils/slack';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions))!;

  if (!session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const stripe = initStripe();
  const db = initDb();

  const { stripeAccount, stripeConnected } = (
    await db.execute('SELECT stripeAccount, stripeConnected FROM `pricing-tables`.`User` WHERE `id` = ?', [session.user.id])
  ).rows[0] as { stripeAccount: string; stripeConnected: boolean };

  if (!stripeAccount) {
    res.status(200).json({ connected: false });
    return;
  }

  if (stripeConnected) {
    res.status(200).json({ connected: true });
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    await db.transaction(async (tx) => {
      // eslint-disable-next-line max-len
      await tx.execute('UPDATE `pricing-tables`.`User` SET `stripeConnected` = true, `stripeKey` = null WHERE `id` = ?', [session.user!.id]);
    });

    res.status(200).json({ connected: true });
    notifyOfNewSetup({ name: session.user.name! });
    return;
  }

  res.status(200).json({ connected: false });
}
