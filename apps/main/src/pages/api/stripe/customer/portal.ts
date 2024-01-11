import type { NextApiRequest, NextApiResponse } from 'next';

import { env } from 'env/server.mjs';
import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customer_id } = req.query as { customer_id?: string };
  const stripe = initStripe();
  const db = initDb();

  const checkoutRecord = (
    await db.execute(`
      SELECT US1.stripeCustomerId, US2.stripeAccount
      FROM CheckoutRecord CR
          JOIN User US1 ON CR.userId = US1.id
          JOIN PriceWidget PW ON CR.widgetId = PW.id
          JOIN User US2 ON PW.userId = US2.id
      WHERE CR.isActive = true AND US1.stripeCustomerId = ?
    `, [customer_id])
  ).rows[0] as { stripeCustomerId?: string; stripeAccount?: string };

  if (!checkoutRecord) {
    res.status(400).json({ error: 'No checkout record found' });
    return;
  }
  const { stripeCustomerId, stripeAccount } = checkoutRecord;

  if (!stripeCustomerId) {
    console.log('❌ No Stripe customer ID found');
    res.status(400).json({ error: 'No information found' });
    return;
  }

  if (!stripeAccount) {
    console.log('❌ No Stripe account ID found');
    res.status(400).json({ error: 'No information found' });
    return;
  }

  const platformUrl = process.env.PLATFORM_URL ?? env.NEXTAUTH_URL;
  const refererUrl = req.headers['referer'];

  const customerPortal = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: refererUrl ?? `${platformUrl}/dashboard`,
  }, { stripeAccount });

  res.redirect(303, customerPortal.url);
}

export default handler;
