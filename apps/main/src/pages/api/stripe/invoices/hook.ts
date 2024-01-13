import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import { corsMiddleware, stripeEventMiddleware } from 'utils/api';
import { isLocalServer } from 'utils/environments';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfInvoiceFailedToFinalize, notifyOfInvoicePaymentActionRequired } from 'utils/slack';

export const config = {
  api: {
    bodyParser: isLocalServer(),
  },
};

async function handler(_req: NextApiRequest, res: NextApiResponse, event: Stripe.Event) {
  const { data } = event as Stripe.Event;
  const { id: invoiceId, subscription: subscriptionId } = data.object as Stripe.Invoice;

  const stripe = initStripe();
  const db = initDb();

  const dbInfo = (
    await db.execute(`
      SELECT US1.id, US1.name, US1.email, US2.stripeAccount
      FROM Subscription SUB
          JOIN User US1 ON SUB.userId = US1.id
          JOIN PriceWidget PW ON SUB.widgetId = PW.id
          JOIN User US2 ON PW.userId = US2.id
      WHERE SUB.id = ?
      `, [subscriptionId])
  ).rows[0] as { id: string; name: string; email: string; stripeAccount: string } | undefined;

  if (!dbInfo) {
    res.status(200).json({ source: 'Dealo', received: true });
    return;
  }

  const { stripeAccount } = dbInfo;
  const invoice = await stripe.invoices.retrieve(invoiceId, { expand: ['subscription'] }, { stripeAccount });
  const subscription = invoice.subscription as Stripe.Subscription;

  if (event.type === 'invoice.created') {
    // TODO: might need to do more checks here
    await stripe.invoices.finalizeInvoice(invoiceId, { stripeAccount });
  }

  if (event.type === 'invoice.finalization_failed') {
    // noinspection ES6MissingAwait
    notifyOfInvoiceFailedToFinalize({
      name: dbInfo.name,
      email: dbInfo.email,
      invoiceId,
      subscriptionId: subscription.id,
    });
  }

  if (event.type === 'invoice.payment_action_required') {
    // noinspection ES6MissingAwait
    notifyOfInvoicePaymentActionRequired({
      name: dbInfo.name,
      email: dbInfo.email,
      invoiceId,
      subscriptionId: subscription.id,
    });
  }

  if (event.type === 'invoice.paid') {
    await db.execute(
      'UPDATE Subscription SET currrentPeriodStart = ?, currentPeriodEnd = ? WHERE status = ? AND id = ?',
      [subscription.current_period_start, subscription.current_period_end, 'active' as Stripe.Subscription.Status, subscriptionId],
    );
  }

  res.status(200).json({ source: 'Dealo', received: true });
}

export default corsMiddleware(stripeEventMiddleware(handler, env.STRIPE_INVOICE_WEBHOOK_SECRET));
