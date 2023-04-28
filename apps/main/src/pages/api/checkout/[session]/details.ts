import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { cuidZodValidator } from 'utils/validations';

const input = z.object({
  session: cuidZodValidator,
});

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

export default async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const parsed = input.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid session' });
    return;
  }

  const { session } = parsed.data;

  const db = initDb();

  const sessionQuery = (
    await db.execute(
      `SELECT CK.widgetId, CK.productId, CK.priceId, CK.email, PW.color, PW.unitLabel, PW.userId, U.stripeKey
        FROM Checkout CK JOIN PriceWidget PW ON CK.widgetId = PW.id JOIN User U ON PW.userId = U.id
        WHERE CK.id = ?`,
      [session],
    )
  ).rows[0] as SessionQuery;

  const stripe = initStripe(sessionQuery.stripeKey);

  const product = await stripe.products.retrieve(sessionQuery.productId);
  const price = await stripe.prices.retrieve(sessionQuery.priceId, { expand: ['currency_options'] });

  const seconds = 60;
  res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=360`);
  return res.status(200).json({
    color: sessionQuery.color,
    email: sessionQuery.email,
    product: {
      name: product.name,
      description: product.description,
      price: {
        currency: price.currency,
        currency_options: price.currency_options,
        unit_amount: price.unit_amount,
        unit_amount_decimal: price.unit_amount_decimal,
        billing_scheme: price.billing_scheme,
        recurring: price.recurring,
        transform_quantity: price.transform_quantity,
        type: price.type,
      },
    }
  });
}
