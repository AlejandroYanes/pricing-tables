/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createId } from '@paralleldrive/cuid2';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId, priceId } = req.body;

  try {
    const db = initDb();
    const features = (
      await db.execute('SELECT DISTINCT `pricing-tables`.`Feature`.id, `pricing-tables`.`Feature`.name, `pricing-tables`.`Feature`.type FROM `pricing-tables`.`Feature` WHERE `widgetId` = ?', [widget])
    ).rows as { id: string; name: string; type: string }[];

    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Product` (`id`, `widgetId`, `mask`) VALUES(?, ?, ?)',
        [productId, widget, createId()],
      );

      await tx.execute(
        'INSERT INTO `pricing-tables`.`Price` (`id`, `productId`, `widgetId`, `mask`) VALUES(?, ?, ?, ?)',
        [priceId, productId, widget, createId()],
      );

      for (let i = 0; i < features.length; i++) {
        const feature = features[i]!;
        const value = feature.type === 'boolean' ? 'false' : '';

        await tx.execute(
          'INSERT INTO `pricing-tables`.`Feature` (`id`, `name`, `type`, `value`, `widgetId`, `productId`) VALUES(?, ?, ?, ?, ?, ?)',
          [feature.id, feature.name, feature.type, value, widget, productId],
        );
      }
    });
    res.status(201).json({ widget, productId, priceId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addProduct);
