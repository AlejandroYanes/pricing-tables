import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { ROLES } from '@dealo/models';

import { env } from 'env/server.mjs';
import { corsMiddleware, stripeEventMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfNewSubscription, notifyOfSubscriptionMissingParams, notifyOfSubscriptionPaymentFailed, } from 'utils/slack';
import { sendFailedPaymentEmail, sendSubscriptionCreatedEmail } from 'utils/resend';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(_req: NextApiRequest, res: NextApiResponse, event: Stripe.Event) {
  const stripe = initStripe();

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
    if (!isFromPlatform || !isInternalFlow) {
      res.status(200).json({ source: 'Dealo', received: true });
    }

    const hasMissingParams = !session.subscription || !session.customer;
    if (hasMissingParams) {
      console.log(`❌ Webhook Error: missing params`);
      await notifyOfSubscriptionMissingParams({
        name: (session.customer as Stripe.Customer).name!,
        email: (session.customer as Stripe.Customer).email!,
        missingCustomer: !session.customer,
        missingSubscription: !session.subscription,
      });
      return res.status(200).json({
        source: 'Dealo',
        received: true,
        message: 'Missing params.',
      });
    }

    const customer = session.customer as Stripe.Customer;
    const { id: subscriptionId } = session.subscription as Stripe.Subscription;
    const { widgetId, productId, priceId } = session.metadata!;
    const db = initDb();

    const { id: userId, name, email } = (
      await db.execute('SELECT id, name, email FROM User WHERE email = ?', [customer.email])
    ).rows[0] as { id: string; name: string; email: string };

    if (session.payment_status !== 'paid') {
      console.log(`❌ Webhook Error: payment failed`);

      await notifyOfSubscriptionPaymentFailed({
        name,
        email,
        subscriptionId: subscriptionId,
      });
      await sendFailedPaymentEmail({ to: email, name });
      res.status(200).json({
        source: 'Dealo',
        received: true,
        message: 'Payment failed.',
      });
      return;
    }

    const { status, current_period_start, current_period_end, trial_start, trial_end } = session.subscription as Stripe.Subscription;

    await db.transaction(async (tx) => {
      await tx.execute(
        'UPDATE User SET stripeCustomerId = ?, role = ? WHERE id = ?',
        [customer.id, ROLES.PAID, userId],
      );
      await tx.execute(
        // eslint-disable-next-line max-len
        'INSERT INTO Subscription(id, userId, widgetId, productId, priceId, currentPeriodStart, currentPeriodEnd, trialStart, trialEnd, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        // eslint-disable-next-line max-len
        [subscriptionId, userId, widgetId, productId, priceId, current_period_start, current_period_end, trial_start, trial_end, status],
      );
    });

    await notifyOfNewSubscription({ name, email });
    await sendSubscriptionCreatedEmail({ name, to: email });
  }

  res.status(200).json({ source: 'Dealo', received: true });
}

export default corsMiddleware(stripeEventMiddleware(handler, env.STRIPE_CHECKOUT_WEBHOOK_SECRET));
