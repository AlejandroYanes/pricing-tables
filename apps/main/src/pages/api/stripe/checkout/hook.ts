import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { createId } from '@paralleldrive/cuid2';

// import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfNewSubscription, notifyOfSubscriptionMissingParams, notifyOfSubscriptionPaymentFailed } from '../../../../utils/slack';
// import { buffer } from 'utils/api';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const signature = req.headers['stripe-signature']!;

  const stripe = initStripe();
  const event: Stripe.Event = req.body as Stripe.Event;

  // try {
  //   const payload = await buffer(req);
  //   event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_CHECKOUT_WEBHOOK_SECRET);
  // } catch (err: any) {
  //   console.log(`❌ Webhook Error: ${err.message}`);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  if (event.type === 'checkout.session.completed') {
    const { account, data } = event as Stripe.Event;
    const { id: sessionId } = data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['customer', 'subscription'] },
      { stripeAccount: account },
    );

    const isFromPlatform = session.metadata?.source === 'dealo';
    const isInternalFlow = session.metadata?.internal_flow === 'true';
    if (!isFromPlatform || isInternalFlow) {
      res.status(200).json({ received: true });
    }

    const hasMissingParams = !session.subscription || !session.customer;
    if (hasMissingParams) {
      console.log(`❌ Webhook Error: missing params`);
      notifyOfSubscriptionMissingParams({
        name: (session.customer as Stripe.Customer).name!,
        missingCustomer: !session.customer,
        missingSubscription: !session.subscription,
      });
      return res.status(400).send(`Webhook Error: missing params`);
    }

    if (session.payment_status !== 'paid') {
      // TODO: notify user of failed payment (eg: send error email to user)
      console.log(`❌ Webhook Error: payment failed`);
      notifyOfSubscriptionPaymentFailed({
        name: (session.customer as Stripe.Customer).name!,
        customerEmail: (session.customer as Stripe.Customer).email!,
        subscriptionId: (session.subscription as Stripe.Subscription).id,
      });
      res.status(200).json({ received: true });
    }

    if (isInternalFlow) {
      const customer = session.customer as Stripe.Customer;
      const { id: subscriptionId, current_period_start, current_period_end } = session.subscription as Stripe.Subscription;
      const { widgetId, productId, priceId } = session.metadata!;
      const db = initDb();

      const { id: userId, name } = (
        await db.execute('SELECT id, name FROM User WHERE email = ?', [customer.email])
      ).rows[0] as { id: string; name: string };

      await db.transaction(async (tx) => {
        await tx.execute('UPDATE User SET stripeCustomerId = ? WHERE id = ?', [customer.id, userId]);
        await tx.execute('UPDATE CheckoutRecord SET isActive = false WHERE userId = ?', [userId]);
        await tx.execute(
          // eslint-disable-next-line max-len
          'INSERT INTO CheckoutRecord(id, sessionId, userId, widgetId, productId, priceId, subscriptionId, currrentPeriodStart, currentPeriodEnd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [createId(), sessionId, userId, widgetId, productId, priceId, subscriptionId, current_period_start, current_period_end],
        );
      });

      await notifyOfNewSubscription({ name });
      // TODO: send confirmation email to user
    }
  }

  res.status(200).json({ received: true });
}
