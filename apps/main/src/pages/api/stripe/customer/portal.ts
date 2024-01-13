import type { NextApiRequest, NextApiResponse } from 'next';
import { type AuthenticatedSession } from 'next-auth';
import type Stripe from 'stripe';

import { env } from 'env/server.mjs';
import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';
import { authMiddleware } from 'utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) {
  const stripe = initStripe();
  const db = initDb();

  const checkoutRecord = (
    await db.execute(`
      SELECT US1.stripeCustomerId, US2.stripeAccount
      FROM Subscription SUB
          JOIN User US1 ON SUB.userId = US1.id
          JOIN PriceWidget PW ON SUB.widgetId = PW.id
          JOIN User US2 ON PW.userId = US2.id
      WHERE SUB.status = ? AND US1.id = ?
    `, ['active' as Stripe.Subscription.Status, session.user.id])
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

export default authMiddleware(handler);
