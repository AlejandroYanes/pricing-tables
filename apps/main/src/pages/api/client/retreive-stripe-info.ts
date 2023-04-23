/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { corsMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: z.string().cuid(),
  price_id: z.string().cuid(),
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

  const { widget_id, product_id, price_id } = req.query;

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
