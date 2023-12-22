import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

// import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
// import { buffer } from 'utils/api';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers['stripe-signature']!;

  const stripe = initStripe();
  const event: Stripe.Event = req.body as Stripe.Event;

  // try {
  //   const payload = await buffer(req);
  //   event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_CHECKOUT_WEBHOOK_SECRET);
  // } catch (err: any) {
  //   console.log(`❌ Webhook Error: ${err.message}`);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  // TODO: handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const { account, data } = event as Stripe.Event;
    const { id: sessionId } = data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(sessionId, { stripeAccount: account });

    const isFromPlatform = session.metadata?.source === 'dealo';
    if (!isFromPlatform) {
      console.log(`❌ Webhook Error: event not from platform`);
      return res.status(400).send(`Webhook Error: event not from platform`);
    }

    const hasMissingParams = !session.subscription || !session.customer;
    if (hasMissingParams) {
      // TODO: handle failed payment (eg: send error email to user)
      console.log(`❌ Webhook Error: missing params`);
      return res.status(400).send(`Webhook Error: missing params`);
    }

    if (session.payment_status !== 'paid') {
      // TODO: handle failed payment (eg: send error email to user)
      console.log(`❌ Webhook Error: payment failed`);
      return res.status(400).send(`Webhook Error: payment failed`);
    }

    // TODO: update user's subscription status
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        `UPDATE User SET stripeSubscriptionId = ?, stripeCustomerId = ? WHERE stripeAccount = ?`,
        [session.subscription, session.customer, account],
      );
    });

    // TODO: send confirmation email to user
  }

  res.status(200).json({ received: true });
}
