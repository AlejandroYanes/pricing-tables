import type { NextApiRequest, NextApiResponse } from 'next';
import { type AuthenticatedSession } from 'next-auth';

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
      FROM CheckoutRecord CR
          JOIN User US1 ON CR.userId = US1.id
          JOIN PriceWidget PW ON CR.widgetId = PW.id
          JOIN User US2 ON PW.userId = US2.id
      WHERE CR.isActive = true AND US1.id = ?
    `, [session.user.id])
  ).rows[0] as { stripeCustomerId?: string; stripeAccount?: string };

  if (!checkoutRecord) {
    res.status(400).json({ error: 'No checkout record found' });
    return;
  }
  const { stripeCustomerId, stripeAccount } = checkoutRecord;

  if (!stripeCustomerId) {
    res.status(400).json({ error: 'No Stripe customer ID found' });
    return;
  }

  if (!stripeAccount) {
    res.status(400).json({ error: 'No Stripe account ID found' });
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
