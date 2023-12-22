import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import initDb from 'utils/planet-scale';
import { notifyOfNewSetup } from 'utils/slack';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: Stripe.Event = req.body;

  if (event.type === 'account.updated') {
    const { id, charges_enabled } = event.data.object as Stripe.Account;

    if (charges_enabled) {
      const db = initDb();
      await db.transaction(async (tx) => {
        await tx.execute('UPDATE User SET stripeConnected = true, stripeKey = null WHERE stripeAccount = ?', [id]);
      });
      const { name } = (
        await db.execute('SELECT name FROM User WHERE stripeAccount = ?', [id])
      ).rows[0] as { name: string };
      notifyOfNewSetup({ name });
    }
  }

  res.status(200).json({ received: true });
}
