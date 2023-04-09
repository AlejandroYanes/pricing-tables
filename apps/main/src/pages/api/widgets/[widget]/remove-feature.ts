import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function removeFeature(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { id } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'DELETE FROM `pricing-tables`.`Feature` WHERE `id` = ? AND `widgetId` = ?',
        [id, widget],
      );
    });
    res.status(201).json({ widget, id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(removeFeature);
