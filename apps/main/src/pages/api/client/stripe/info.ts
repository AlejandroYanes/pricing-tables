/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

import { corsMiddleware } from 'utils/api';

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: z.string().cuid2(),
  price_id: z.string().cuid2(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.headers['X-Api-Key'] as string;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsedBody = inputSchema.safeParse(req.query);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const { widget_id, product_id, price_id } = parsedBody.data;

  try {
    const client = await sql.connect();

    const product = (
      await client.sql`SELECT Product.id FROM Product WHERE mask = ${product_id} AND widgetId = ${widget_id}`
    ).rows as { id: string }[];
    const price = (
      await client.sql`SELECT id FROM "Price" WHERE mask = ${price_id} AND "widgetId" = ${widget_id}`
    ).rows as { id: string }[];

    client.release();

    if (!product[0] || !price[0]) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }

    res.status(200).json({ product: product[0].id, price: price[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default corsMiddleware(handler);
