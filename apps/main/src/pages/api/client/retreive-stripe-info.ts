/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

import { corsMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { widget_id, product_id, price_id } = req.query;
  const userId = req.headers['X-Api-Key'] as string;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const db = initDb();

    const product = (
      await db.execute('SELECT `pricing-tables`.Product.id FROM `pricing-tables`.`Product` WHERE `mask` = ? AND `widgetId` = ?', [product_id, widget_id])
    ).rows as { id: string }[];
    const price = (
      await db.execute('SELECT `pricing-tables`.Price.id FROM `pricing-tables`.Price WHERE `mask` = ? AND `widgetId` = ?', [price_id, widget_id])
    ).rows as { id: string }[];

    if (!product[0] || !price[0]) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }

    res.status(200).json({ product: product[0].id, price: price[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default corsMiddleware(handler);
