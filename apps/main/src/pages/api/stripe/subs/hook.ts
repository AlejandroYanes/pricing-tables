import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import type Stripe from 'stripe';
import { ROLES } from '@dealo/models';

import { env } from 'env/server.mjs';
import { corsMiddleware, stripeEventMiddleware } from 'utils/api';
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

  const client = await sql.connect();

  const dbInfo = (
    await client.sql<{ id: string; name: string; email: string }>`
      SELECT US1.id, US1.name, US1.email
      FROM "Subscription" SUB
        JOIN User US1 ON SUB."userId" = US1.id
      WHERE SUB.id = ${subsId}
    `
  ).rows[0];

  if (!dbInfo) {
    client.release();
    res.status(200).json({ source: 'Dealo', received: true });
    return;
  }

  if (event.type === 'customer.subscription.trial_will_end') {
    const { default_payment_method } = subscription;

    if (!default_payment_method) {
      console.log(`⚠️ Subscriptions: User's subscription trial is ending but they have no payment method set up.`);
      await notifyOfSubscriptionMissingPaymentMethod({ email: dbInfo.email, name: dbInfo.name });
    }
  }

  if (event.type === 'customer.subscription.paused') {
    await client.sql`UPDATE "Subscription" SET status = ${subscription.status} WHERE id = ${subsId}`;
    await client.sql`UPDATE "User" SET role = ${ROLES.USER} WHERE id = ${dbInfo.id}`;

    await notifyOfSubscriptionPaused({ name: dbInfo.name, email: dbInfo.email });
  }

  if (event.type === 'customer.subscription.resumed') {
    await client.sql`UPDATE "Subscription" SET status = ${subscription.status} WHERE id = ${subsId}`;
    await client.sql`UPDATE "User" SET role = ${ROLES.PAID} WHERE id = ${dbInfo.id}`;

    await notifyOfSubscriptionResumed({ name: dbInfo.name, email: dbInfo.email });
  }

  if (event.type === 'customer.subscription.updated') {
    const { cancel_at, canceled_at, cancellation_details, status } = subscription;
    const previousAttributes = event.data.previous_attributes as Partial<Stripe.Subscription>;

    const isResuming = status === 'active' && previousAttributes.status === 'trialing';
    const isCancelling = cancel_at && !previousAttributes.cancel_at;
    const isRenewing = !canceled_at && previousAttributes.canceled_at;

    if (isCancelling) {
      const { name, email } = dbInfo;
      await client.sql`
        UPDATE "Subscription" SET
          "cancelAt" = ${cancel_at},
          "cancelledAt" = ${canceled_at},
          "cancellationDetails" = '${JSON.stringify(cancellation_details)}'
        WHERE id = '${subsId}'`;

      await notifyOfSubscriptionSoftCancellation({ name, email, cancelAt: cancel_at! });
      await sendSubscriptionCancelledEmail({ name, to: email });
    }

    if (isRenewing) {
      await client.sql`
        UPDATE "Subscription" SET
          "cancelAt" = NULL,
          "cancelledAt" = NULL,
          "cancellationDetails" = NULL
        WHERE id = ${subsId}`;

      await notifyOfRenewedSubscription({ name: dbInfo.name, email: dbInfo.email });
    }

    if (isResuming) {
      await client.sql`UPDATE "Subscription" SET status = ${status} WHERE id = ${subsId}`;
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    await client.sql`UPDATE "Subscription" SET status = ${subscription.status} WHERE id = ${subsId}`;
    await client.sql`UPDATE "User" SET role = ${ROLES.USER} WHERE id = ${dbInfo.id}`;

    await notifyOfSubscriptionCancellation({ name: dbInfo.name, email: dbInfo.email });
  }

  client.release();

  res.status(200).json({ source: 'Dealo', received: true });
}

export default corsMiddleware(stripeEventMiddleware(handler, env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET));
