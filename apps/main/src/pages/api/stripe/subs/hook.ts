import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

// import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
// import initStripe from 'utils/stripe';
// import { buffer } from 'utils/api';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const signature = req.headers['stripe-signature']!;

  // const stripe = initStripe();
  const event: Stripe.Event = req.body as Stripe.Event;

  // try {
  //   const payload = await buffer(req);
  //   event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET);
  // } catch (err: any) {
  //   console.log(`❌ Webhook Error: ${err.message}`);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  if (event.type === 'customer.subscription.deleted') {
    const { data } = event as Stripe.Event;
    const { id: subsId } = data.object as Stripe.Subscription;

    const db = initDb();

    const dbInfo = (
      await db.execute(`
        SELECT US1.id
        FROM CheckoutRecord CR
          JOIN User US1 ON CR.userId = US1.id
        WHERE CR.isActive = true AND CR.stripeSubscriptionId = ?
      `, [subsId])
    ).rows[0] as { id: string } | undefined;

    if (dbInfo) {
      const { id: userId } = dbInfo;
      await db.transaction(async (tx) => {
        await tx.execute('UPDATE CheckoutRecord SET isActive = FALSE WHERE isActive = TRUE AND userId = ?', [userId]);
        await tx.execute('UPDATE User SET stripeSubscriptionId = NULL WHERE id = ?', [userId]);
      });
    }
  }

  res.status(200).json({ received: true });
}
