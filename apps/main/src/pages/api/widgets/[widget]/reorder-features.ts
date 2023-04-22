import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function reorderFeatures(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const ids = req.body.ids as string[];

  try {
    const db = initDb();
    const sources = (
      await db.execute(
        'SELECT `pricing-tables`.`Feature`.`id`, `pricing-tables`.`Feature`.`createdAt` FROM `pricing-tables`.`Feature` WHERE `id` IN(?)',
        [ids],
      )
    ).rows as { id: string; createdAt: string }[];

    const idDatePairs = ids.map((id, index) => ({ id, createdAt: sources[index]!.createdAt }));
    const orderedDates = idDatePairs.map((pair) => pair.createdAt).sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);

    idDatePairs.forEach((pair, index) => {
      pair.createdAt = orderedDates[index]!;
    });

    await db.transaction(async (tx) => {
      for (let i = 0; i < idDatePairs.length; i++) {
        const pair = idDatePairs[i]!;
        await tx.execute('UPDATE `pricing-tables`.`Feature` SET `createdAt` = ? WHERE `id` = ?', [pair.createdAt, pair.id]);
      }
    });
    res.status(201).json({ widget });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(reorderFeatures);