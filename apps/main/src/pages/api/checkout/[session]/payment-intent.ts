import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { cuidZodValidator } from 'utils/validations';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';

const input = z.object({
  session: cuidZodValidator,
});

type SessionQuery = {
  productId: string;
  priceId: string;
  currency: string;
  stripeKey: string;
}

export default async function createPaymentIntent(req: NextApiRequest, res: NextApiResponse) {
  const parsed = input.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid session' });
    return;
  }

  const { session } = parsed.data;

  const db = initDb();

  const sessionQuery = (
    await db.execute(
      `SELECT CK.productId, CK.priceId, CK.currency, U.stripeKey
        FROM Checkout CK JOIN PriceWidget PW ON CK.widgetId = PW.id JOIN User U ON PW.userId = U.id
        WHERE CK.id = ?`,
      [session],
    )
  ).rows[0] as SessionQuery;

  const stripe = initStripe(sessionQuery.stripeKey);
  const price = await stripe.prices.retrieve(sessionQuery.priceId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price.unit_amount!,
    currency: sessionQuery.currency,
    automatic_payment_methods: {
      enabled: false,
    },
  });

  res.json({
    secret: paymentIntent.client_secret,
  });
}
