import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

// import { env } from 'env/server.mjs';
import { corsMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import {
  notifyOfRenewedSubscription,
  notifyOfSubscriptionCancellation,
  notifyOfSubscriptionSoftCancellation
} from 'utils/slack';
import { sendSubscriptionCancelledEmail } from 'utils/resend';
// import initStripe from 'utils/stripe';
// import { buffer } from 'utils/api';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  const { data } = event as Stripe.Event;
  const subscription = data.object as Stripe.Subscription;
  const { id: subsId } = subscription;

  const db = initDb();

  const dbInfo = (
    await db.execute(`
        SELECT US1.id, US1.name, US1.email
        FROM CheckoutRecord CR
          JOIN User US1 ON CR.userId = US1.id
        WHERE CR.isActive = true AND CR.subscriptionId = ?
      `, [subsId])
  ).rows[0] as { id: string; name: string; email: string } | undefined;

  if (!dbInfo) {
    res.status(200).json({ received: true });
    return;
  }

  if (event.type === 'customer.subscription.deleted') {
    const { id: userId, name } = dbInfo;
    await db.transaction(async (tx) => {
      await tx.execute('UPDATE CheckoutRecord SET isActive = FALSE WHERE isActive = TRUE AND userId = ?', [userId]);
    });
    notifyOfSubscriptionCancellation({ name });
  }

  if (event.type === 'customer.subscription.updated') {
    const { cancel_at, canceled_at, cancellation_details } = subscription;
    const previousAttributes = event.data.previous_attributes as Partial<Stripe.Subscription>;
    const isCancelling = cancel_at && !previousAttributes.cancel_at;
    const isRenewing = !canceled_at && previousAttributes.canceled_at;

    if (isCancelling) {
      const { id: userId, name, email } = dbInfo;
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE CheckoutRecord SET cancelAt = ?, cancelledAt = ?, cancellationDetails = ? WHERE isActive = TRUE AND userId = ?',
          [cancel_at, canceled_at, JSON.stringify(cancellation_details), userId],
        );
      });
      // noinspection ES6MissingAwait
      notifyOfSubscriptionSoftCancellation({ name, cancelAt: cancel_at! });
      // noinspection ES6MissingAwait
      sendSubscriptionCancelledEmail({ name, to: email });
    }

    if (isRenewing) {
      const { id: userId, name } = dbInfo;
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE CheckoutRecord SET cancelAt = NULL, cancelledAt = NULL, cancellationDetails = NULL WHERE isActive = TRUE AND userId = ?',
          [userId],
        );
      });
      // noinspection ES6MissingAwait
      notifyOfRenewedSubscription({ name });
    }
  }

  res.status(200).json({ received: true });
}

export default corsMiddleware(handler);
