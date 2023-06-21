import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addCallback(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { id, env, url } = req.body;

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Callback` (`id`, `env`, `url`, `widgetId`) VALUES(?, ?, ?, ?)',
        [id, env, url, widget],
      );
    });
    res.status(201).json({ widget, id, env, url });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addCallback);
