import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfNewSetup } from 'utils/slack';
import { buffer } from 'utils/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    const payload = await buffer(req);
    const stripe = initStripe();
    event = stripe.webhooks.constructEvent(payload, sig, env.STRIPE_CONNECT_WEBHOOK_SECRET);
  } catch (err: any) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

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
