import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import initDb from 'utils/planet-scale';
import { cuidZodValidator } from 'utils/validations';
import initStripe from 'utils/stripe';

type SessionQuery = {
  widgetId: string;
  productId: string;
  priceId: string;
  email: string;
  color: string;
  unitLabel: string;
  userId: string;
  stripeKey: string;
}

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: cuidZodValidator,
  price_id: cuidZodValidator,
  currency: z.string().length(3),
  email: z.string().email().optional(),
  disable_email: z.boolean().optional(),
});

export default async function createStripeCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  console.log('------------------');
  console.log('createStripeCheckoutSession API route');
  console.log('------------------');

  const parsedBody = inputSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { widget_id: widgetId, product_id: prodMask, price_id: priceMask } = parsedBody.data;
  const db = initDb();

  const sessionQuery = (
    await db.execute(
      `SELECT PW.userId, U.stripeKey, PROD.id as productId, PRI.id as priceId
        FROM
            PriceWidget PW JOIN Product PROD on PW.id = PROD.widgetId
                JOIN Price PRI on PRI.widgetId = PW.id
                JOIN User U on PW.userId = U.id
        WHERE PW.id = ? AND PROD.mask = ? AND PRI.mask = ?`,
      [widgetId, prodMask, priceMask],
    )
  ).rows[0] as SessionQuery;

  const { priceId, stripeKey } = sessionQuery;

  const stripe = initStripe(stripeKey);

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: 'http://localhost:3000/checkout/success',
    cancel_url: 'http://localhost:3000/checkout/error',
  });

  if (!checkoutSession.url) {
    res.status(400).json({ error: 'Failed to create checkout session' });
    return;
  }

  res.status(200).json({ url: checkoutSession.url });
}
