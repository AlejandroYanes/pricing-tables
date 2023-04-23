import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';

import initDb from 'utils/planet-scale';

export const config = {
  runtime: 'edge',
  regions: ['dub1'],
}

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: z.string().cuid(),
  price_id: z.string().cuid(),
  email: z.string().email().optional(),
});

export default async function createCheckoutSession(req: NextApiRequest, res: NextApiResponse) {

  const parsedBody = inputSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { widget_id: widgetId, product_id: prodMask, price_id: priceMask, email = null } = parsedBody.data;
  const db = initDb();
  const sessionId = createId();

  const [prodQuery, priceQuery] = await Promise.all([
    db.execute('SELECT `Product`.id FROM `pricing-tables`.Product WHERE mask = ?', [prodMask]),
    db.execute('SELECT `Price`.id FROM `pricing-tables`.Price WHERE mask = ?', [priceMask]),
  ]);

  const { id: productId } = prodQuery.rows[0] as { id: string };
  const { id: priceId } = priceQuery.rows[0] as { id: string };
  // eslint-disable-next-line max-len
  await db.execute('INSERT INTO `pricing-tables`.Checkout (id, widgetId, productId, priceId, email) VALUES (?, ?, ?, ?, ?)', [sessionId, widgetId, productId, priceId, email]);

  res.status(200).json({ session: sessionId });
}
