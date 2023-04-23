import type { NextApiRequest, NextApiResponse } from 'next';

import initDb from 'utils/planet-scale';
import { hashString } from 'utils/hash';

export const config = {
  runtime: 'edge',
  regions: ['dub1'],
}

export default async function createCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  const { widgetId, productId, priceId } = req.body;
  const db = initDb();
  const id = hashString(`${Date.now()}:${widgetId}-${productId}-${priceId}`);
  // eslint-disable-next-line max-len
  await db.execute('INSERT INTO `pricing-tables`.Checkout (id, widgetId, productId, priceId) VALUES (?, ?, ?, ?)', [id, widgetId, productId, priceId]);

  res.status(200).json({ session: id });
}
