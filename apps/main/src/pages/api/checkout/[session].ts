import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';
import { cuidZodValidator } from 'utils/validations';

const input = z.object({
  session: cuidZodValidator,
});

export default async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const parsed = input.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid session' });
    return;
  }

  const { session } = parsed.data;

  const db = initDb();

  const sessionData = (
    await db.execute('SELECT `widgetId`, `productId`, `priceId` FROM `pricing-tables`.Checkout WHERE id = ?', [session])
  ).rows[0] as { widgetId: string; productId: string; priceId: string };

  const widget = (
    await db.execute('SELECT `userId`, `color` FROM `pricing-tables`.PriceWidget WHERE id = ?', [sessionData.widgetId])
  ).rows[0] as { userId: string; color: string };

  const user = (
    await db.execute('SELECT `stripeKey` FROM `pricing-tables`.User WHERE id = ?', [widget.userId])
  ).rows[0] as { stripeKey: string };

  const stripe = initStripe(user.stripeKey);

  const product = await stripe.products.retrieve(sessionData.productId);
  const price = await stripe.prices.retrieve(sessionData.priceId, { expand: ['data.currency_options'] });

  const seconds = 60;
  res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=360`);
  return res.status(200).json({
    color: widget.color,
    product: {
      name: product.name,
      description: product.description,
      price: {
        currency: price.currency,
        currency_options: price.currency_options,
        unitAmount: price.unit_amount,
        unitAmountDecimal: price.unit_amount_decimal,
        billing_scheme: price.billing_scheme,
        recurring: price.recurring,
        transform_quantity: price.transform_quantity,
        type: price.type,
      },
    }
  });
}
