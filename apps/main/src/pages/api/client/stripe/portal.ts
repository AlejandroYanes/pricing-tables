import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

import initStripe from 'utils/stripe';
import { corsMiddleware } from 'utils/api';

const inputSchema = z.object({
  customer_id: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.headers['X-Api-Key'] as string;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsedBody = inputSchema.safeParse(req.query);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { customer_id } = parsedBody.data;

  const stripe = initStripe();

  const { stripeAccount } = (
    await sql`SELECT "stripeAccount" FROM "User" WHERE id = ${userId}`
  ).rows[0] as { stripeAccount: string };

  if (!customer_id) {
    res.status(400).json({ error: 'No Stripe customer ID found' });
    return;
  }

  if (!stripeAccount) {
    res.status(400).json({ error: 'No Stripe account ID found' });
    return;
  }

  const refererUrl = req.headers['referer'];

  const customerPortal = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: refererUrl,
  }, { stripeAccount });

  res.redirect(303, customerPortal.url);
}

export default corsMiddleware(handler);
