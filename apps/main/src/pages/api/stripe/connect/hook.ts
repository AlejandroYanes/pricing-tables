import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import initDb from 'utils/planet-scale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: Stripe.Event = req.body;

  if (event.type === 'account.updated') {
    const { id, charges_enabled } = event.data.object as Stripe.Account;

    if (charges_enabled) {
      const db = initDb();
      await db.transaction(async (tx) => {
        await tx.execute('UPDATE `pricing-tables`.`User` SET `stripeConnected` = true, `stripeKey` = null WHERE `stripeAccount` = ?', [id]);
      });
    }
  }

  res.status(200).json({ received: true });
}
