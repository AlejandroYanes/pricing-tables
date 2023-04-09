import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId, priceId } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Product` (`id`, `widgetId`) VALUES(?, ?)',
        [productId, widget],
      );
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Price` (`id`, `productId`, `widgetId`) VALUES(?, ?, ?)',
        [priceId, productId, widget],
      );
    });
    res.status(201).json({ widget, productId, priceId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addProduct);
