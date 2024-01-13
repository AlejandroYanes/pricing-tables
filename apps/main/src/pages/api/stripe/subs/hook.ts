import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { ROLES } from '@dealo/models';

import { env } from 'env/server.mjs';
import { corsMiddleware, stripeEventMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import { sendSubscriptionCancelledEmail } from 'utils/resend';
import {
  notifyOfRenewedSubscription,
  notifyOfSubscriptionCancellation,
  notifyOfSubscriptionMissingPaymentMethod,
  notifyOfSubscriptionPaused,
  notifyOfSubscriptionResumed,
  notifyOfSubscriptionSoftCancellation
} from 'utils/slack';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(_req: NextApiRequest, res: NextApiResponse, event: Stripe.Event) {
  const { data } = event as Stripe.Event;
  const subscription = data.object as Stripe.Subscription;
  const { id: subsId } = subscription;

  const db = initDb();

  const dbInfo = (
    await db.execute(`
        SELECT US1.id, US1.name, US1.email
        FROM Subscription SUB
          JOIN User US1 ON SUB.userId = US1.id
        WHERE SUB.id = ?
      `, [subsId])
  ).rows[0] as { id: string; name: string; email: string } | undefined;

  if (!dbInfo) {
    res.status(200).json({ source: 'Dealo', received: true });
    return;
  }

  if (event.type === 'customer.subscription.trial_will_end') {
    const { default_payment_method } = subscription;

    if (!default_payment_method) {
      console.log(`⚠️ Subscriptions: User's subscription trial is ending but they have no payment method set up.`);
      // noinspection ES6MissingAwait
      notifyOfSubscriptionMissingPaymentMethod({ email: dbInfo.email, name: dbInfo.name });
    }
  }

  if (event.type === 'customer.subscription.paused') {
    await db.transaction(async (tx) => {
      await tx.execute(
        'UPDATE Subscription SET status = ? WHERE id = ?',
        [subscription.status, subsId],
      );
      await tx.execute('UPDATE User SET role = ? WHERE id = ?', [ROLES.USER, dbInfo.id]);
    });
    // noinspection ES6MissingAwait
    notifyOfSubscriptionPaused({ name: dbInfo.name, email: dbInfo.email });
  }

  if (event.type === 'customer.subscription.resumed') {
    await db.transaction(async (tx) => {
      await tx.execute(
        'UPDATE Subscription SET status = ? WHERE id = ?',
        [subscription.status, subsId],
      );
      await tx.execute('UPDATE User SET role = ? WHERE id = ?', [ROLES.PAID, dbInfo.id]);
    });
    // noinspection ES6MissingAwait
    notifyOfSubscriptionResumed({ name: dbInfo.name, email: dbInfo.email });
  }

  if (event.type === 'customer.subscription.updated') {
    const { cancel_at, canceled_at, cancellation_details, status } = subscription;
    const previousAttributes = event.data.previous_attributes as Partial<Stripe.Subscription>;

    const isResuming = status === 'active' && previousAttributes.status === 'trialing';
    const isCancelling = cancel_at && !previousAttributes.cancel_at;
    const isRenewing = !canceled_at && previousAttributes.canceled_at;

    if (isCancelling) {
      const { name, email } = dbInfo;
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE Subscription SET cancelAt = ?, cancelledAt = ?, cancellationDetails = ? WHERE id = ?',
          [cancel_at, canceled_at, JSON.stringify(cancellation_details), subsId],
        );
      });
      // noinspection ES6MissingAwait
      notifyOfSubscriptionSoftCancellation({ name, email, cancelAt: cancel_at! });
      // noinspection ES6MissingAwait
      sendSubscriptionCancelledEmail({ name, to: email });
    }

    if (isRenewing) {
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE Subscription SET cancelAt = NULL, cancelledAt = NULL, cancellationDetails = NULL WHERE id = ?',
          [subsId],
        );
      });
      // noinspection ES6MissingAwait
      notifyOfRenewedSubscription({ name: dbInfo.name, email: dbInfo.email });
    }

    if (isResuming) {
      await db.transaction(async (tx) => {
        await tx.execute(
          'UPDATE Subscription SET status = ? WHERE id = ?',
          [status, subsId],
        );
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    await db.transaction(async (tx) => {
      await tx.execute(
        'UPDATE Subscription SET status = ? WHERE id = ?',
        [subscription.status, subsId],
      );
      await tx.execute('UPDATE User SET role = ? WHERE id = ?', [ROLES.USER, dbInfo.id]);
    });
    // noinspection ES6MissingAwait
    notifyOfSubscriptionCancellation({ name: dbInfo.name, email: dbInfo.email });
  }

  res.status(200).json({ source: 'Dealo', received: true });
}

export default corsMiddleware(stripeEventMiddleware(handler, env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET));
