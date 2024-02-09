import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import { corsMiddleware, stripeEventMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfInvoiceFailedToFinalize, notifyOfInvoicePaymentActionRequired } from 'utils/slack';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(_req: NextApiRequest, res: NextApiResponse, event: Stripe.Event) {
  const { data, account } = event as Stripe.Event;
  const { id: invoiceId, subscription: subscriptionId } = data.object as Stripe.Invoice;

  if (account !== env.STRIPE_DEALO_ACCOUNT) {
    res.status(200).json({ source: 'Dealo', received: true });
    return;
  }

  const stripe = initStripe();
  const db = initDb();

  const invoice = await stripe.invoices.retrieve(invoiceId, { expand: ['subscription'] }, { stripeAccount: account });
  const subscription = invoice.subscription as Stripe.Subscription;

  if (event.type === 'invoice.created' && invoice.status === 'draft') {
    await stripe.invoices.finalizeInvoice(invoiceId, { stripeAccount: account });
  }

  if (event.type === 'invoice.finalization_failed') {
    await notifyOfInvoiceFailedToFinalize({
      invoiceId,
      subscriptionId: subscription.id,
      name: invoice.customer_name || 'Unknown',
      email: invoice.customer_email || 'Unknown',
    });
  }

  if (event.type === 'invoice.payment_action_required') {
    await notifyOfInvoicePaymentActionRequired({
      invoiceId,
      subscriptionId: subscription.id,
      name: invoice.customer_name || 'Unknown',
      email: invoice.customer_email || 'Unknown',
    });
  }

  if (event.type === 'invoice.paid') {
    await db.execute(
      'UPDATE Subscription SET currrentPeriodStart = ?, currentPeriodEnd = ? WHERE id = ?',
      [subscription.current_period_start, subscription.current_period_end, subscriptionId],
    );
  }

  res.status(200).json({ source: 'Dealo', received: true });
}

export default corsMiddleware(stripeEventMiddleware(handler, env.STRIPE_INVOICE_WEBHOOK_SECRET));
