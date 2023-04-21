import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function reorderProduct(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { source, destination } = req.body;

  try {
    const db = initDb();
    const sourceProduct = (
      await db.execute(
        'SELECT `pricing-tables`.`Product`.`id`, `pricing-tables`.`Product`.`createdAt` FROM `pricing-tables`.`Product` WHERE `id` = ?',
        [source],
      )
    ).rows[0] as { id: string; createdAt: string };

    const destinationProduct = (
      await db.execute(
        'SELECT `pricing-tables`.`Product`.`id`, `pricing-tables`.`Product`.`createdAt` FROM `pricing-tables`.`Product` WHERE `id` = ?',
        [destination],
      )
    ).rows[0] as { id: string; createdAt: string };
    await db.transaction(async (tx) => {
      const { id, createdAt } = sourceProduct!;
      const { id: destinationId, createdAt: destinationCreatedAt } = destinationProduct!;

      await tx.execute(
        'UPDATE `pricing-tables`.`Product` SET `createdAt` = ? WHERE `id` = ?',
        [destinationCreatedAt, id],
      );

      await tx.execute(
        'UPDATE `pricing-tables`.`Product` SET `createdAt` = ? WHERE `id` = ?',
        [createdAt, destinationId],
      );
    });
    res.status(201).json({ widget });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(reorderProduct);
