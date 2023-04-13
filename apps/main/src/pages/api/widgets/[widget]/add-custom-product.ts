/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import { hashString } from '../../../../utils/hash';

async function addCustomProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId } = req.body;

  try {
    const db = initDb();

    const features = (
      await db.execute('SELECT DISTINCT `pricing-tables`.`Feature`.id, `pricing-tables`.`Feature`.name, `pricing-tables`.`Feature`.type FROM `pricing-tables`.`Feature` WHERE `widgetId` = ?', [widget])
    ).rows as { id: string; name: string; type: string }[];

    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Product` (`id`, `widgetId`, `isCustom`, `name`, `description`, `ctaLabel`, `ctaUrl`, `mask`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        [productId, widget, true, 'Custom Product', 'Custom product are used to present an extra option for users to contact the sales team', 'Contact Us', '', hashString(productId)],
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
    res.status(201).json({ widget, productId });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addCustomProduct);
