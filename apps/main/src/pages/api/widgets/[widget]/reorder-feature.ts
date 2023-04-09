import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function reorderFeature(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { source, destination } = req.body;

  try {
    const db = initDb();
    const sources = (
      await db.execute(
        'SELECT `pricing-tables`.`Feature`.`id`, `pricing-tables`.`Feature`.`createdAt` FROM `pricing-tables`.`Feature` WHERE `id` = ?',
        [source],
      )
    ).rows as { id: string; createdAt: string }[];

    const destinations = (
      await db.execute(
        'SELECT `pricing-tables`.`Feature`.`id`, `pricing-tables`.`Feature`.`createdAt` FROM `pricing-tables`.`Feature` WHERE `id` = ?',
        [destination],
      )
    ).rows as { id: string; createdAt: string }[];
    await db.transaction(async (tx) => {
      for (let i = 0; i<sources.length; i++) {
        const { id, createdAt } = sources[i]!;
        const { id: destinationId, createdAt: destinationCreatedAt } = destinations[i]!;

        await tx.execute(
          'UPDATE `pricing-tables`.`Feature` SET `createdAt` = ? WHERE `id` = ?',
          [destinationCreatedAt, id],
        );

        await tx.execute(
          'UPDATE `pricing-tables`.`Feature` SET `createdAt` = ? WHERE `id` = ?',
          [createdAt, destinationId],
        );
      }
    });
    res.status(201).json({ widget });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(reorderFeature);
