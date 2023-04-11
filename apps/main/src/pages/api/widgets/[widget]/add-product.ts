import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import { hashString } from 'utils/hash';

async function addProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId, priceId } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Product` (`id`, `widgetId`, `mask`) VALUES(?, ?, ?)',
        [productId, widget, hashString(productId)],
      );
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Price` (`id`, `productId`, `widgetId`, `mask`) VALUES(?, ?, ?, ?)',
        [priceId, productId, widget, hashString(priceId)],
      );
    });
    res.status(201).json({ widget, productId, priceId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addProduct);
