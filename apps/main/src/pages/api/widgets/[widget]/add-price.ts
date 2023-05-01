import type { NextApiRequest, NextApiResponse } from 'next';
import { createId } from '@paralleldrive/cuid2';

import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';

async function addPrice(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;
  const { productId, priceId } = req.body;

  if (!widget || !productId || !priceId) {
    res.status(400).json({ error: 'Missing widget, productId or priceId' });
    return;
  }
  const priceMask = createId();

  try {
    const db = initDb();
    await db.transaction(async (tx) => {
      await tx.execute(
        'INSERT INTO `pricing-tables`.`Price` (`id`, `productId`, `widgetId`, `mask`) VALUES(?, ?, ?, ?)',
        [priceId, productId, widget, priceMask],
      );
    });
    res.status(201).json({ priceMask });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export default authMiddleware(addPrice);
