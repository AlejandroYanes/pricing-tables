import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

// import { env } from 'env/server.mjs';
import { corsMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { notifyOfInvoiceFailedToFinalize, notifyOfInvoicePaymentActionRequired } from 'utils/slack';
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
  const { id: invoiceId, subscription: subscriptionId } = data.object as Stripe.Invoice;

  const db = initDb();

  const dbInfo = (
    await db.execute(`
      SELECT US1.id, US1.name, US1.email, US2.stripeAccount
      FROM CheckoutRecord CR
          JOIN User US1 ON CR.userId = US1.id
          JOIN PriceWidget PW ON CR.widgetId = PW.id
          JOIN User US2 ON PW.userId = US2.id
      WHERE CR.isActive = true AND CR.subscriptionId = ?
      `, [subscriptionId])
  ).rows[0] as { id: string; name: string; email: string; stripeAccount: string } | undefined;

  if (!dbInfo) {
    res.status(200).json({ received: true });
    return;
  }

  const { stripeAccount } = dbInfo;
  const stripe = initStripe();
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
      customerEmail: dbInfo.email,
      invoiceId,
      subscriptionId: subscription.id,
    });
  }

  if (event.type === 'invoice.payment_action_required') {
    // noinspection ES6MissingAwait
    notifyOfInvoicePaymentActionRequired({
      name: dbInfo.name,
      customerEmail: dbInfo.email,
      invoiceId,
      subscriptionId: subscription.id,
    });
  }

  if (event.type === 'invoice.paid') {
    await db.execute(
      'UPDATE CheckoutRecord SET currrentPeriodStart = ?, currentPeriodEnd = ? WHERE subscriptionId = ?',
      [subscription.current_period_start, subscription.current_period_end, subscriptionId],
    );
  }

  res.status(200).json({ received: true });
}

export default corsMiddleware(handler);
