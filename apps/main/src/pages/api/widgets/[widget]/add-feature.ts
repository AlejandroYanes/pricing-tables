/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addFeature(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { id, name, type, products } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        await tx.execute(
          'INSERT INTO `pricing-tables`.`Feature` (`id`, `name`, `type`, `value`, `widgetId`, `productId`) VALUES(?, ?, ?, ?, ?, ?)',
          [id, name, type, product.value, widget, product.id],
        );
      }
    });
    res.status(201).json({ widget, id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addFeature);
