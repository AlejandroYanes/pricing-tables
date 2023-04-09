/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addCustomProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Product` (`id`, `widgetId`, `isCustom`, `name`, `description`, `ctaLabel`, `ctaUrl`) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [productId, widget, true, 'Custom Product', 'Custom product are used to present an extra option for users to contact the sales team', 'Contact Us', ''],
      );
    });
    res.status(201).json({ widget, productId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addCustomProduct);
