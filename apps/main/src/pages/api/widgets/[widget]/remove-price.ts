import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function removePrice(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId, priceId } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'DELETE FROM `pricing-tables`.`Price` WHERE `id` = ? AND `productId` = ? AND `widgetId` = ?',
        [priceId, productId, widget],
      );
    });
    res.status(201).json({ widget, productId, priceId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(removePrice);
