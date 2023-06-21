import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function removeCallback(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { env } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'DELETE FROM `pricing-tables`.`Callback` WHERE `env` = ? AND `widgetId` = ?',
        [env, widget],
      );
    });
    res.status(201).json({ widget, env });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(removeCallback);
