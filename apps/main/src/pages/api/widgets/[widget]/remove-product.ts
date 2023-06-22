/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function removeProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId } = req.body;

  try {
    const db = initDb();
    const widgetRecord = (
      await db.execute('SELECT `id`, `recommended` FROM `pricing-tables`.`PriceWidget` WHERE `id` = ?', [widget])
    ).rows[0] as { id: string; recommended: string };

    const relatedPrices = (
      await db.execute(
        'SELECT `id` FROM `pricing-tables`.`Price` WHERE `productId` = ? AND `widgetId` = ?',
        [productId, widget]
      )
    ).rows as { id: number }[];

    await db.transaction(async (tx) => {
      if (relatedPrices.length > 0) {
        await tx.execute(
          'DELETE FROM `pricing-tables`.`Price` WHERE `widgetId` = ? AND `id` IN (?)',
          [widget, relatedPrices.map((p) => p.id)],
        );
      }

      if (widgetRecord.recommended === productId) {
        await tx.execute(
          'UPDATE `pricing-tables`.`PriceWidget` SET `recommended` = NULL WHERE `id` = ?',
          [widget],
        );
      }

      await tx.execute(
        'DELETE FROM `pricing-tables`.`Product` WHERE `id` = ? AND `widgetId` = ?',
        [productId, widget],
      );

      await tx.execute(
        'DELETE FROM `pricing-tables`.`Feature` WHERE `productId` = ? AND `widgetId` = ?',
        [productId, widget],
      );
    });
    res.status(201).json({ widget, productId });
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(removeProduct);
