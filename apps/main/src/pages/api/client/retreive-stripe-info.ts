import type { NextApiRequest, NextApiResponse } from 'next';

import { corsMiddleware } from 'utils/api';
import initDb from '../../../utils/planet-scale';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { product_id, price_id } = req.query;
  const db = initDb();

  const product = await db.execute('SELECT `pricing-tables`.Product.id FROM `pricing-tables`.`Product` WHERE `mask` = ?', [product_id]);
  const price = await db.execute('SELECT `pricing-tables`.Price.id FROM `pricing-tables`.Price WHERE `mask` = ?', [price_id]);

  res.status(200).json({ product, price });
}

export default corsMiddleware(handler);
