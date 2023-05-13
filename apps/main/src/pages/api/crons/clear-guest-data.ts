import type { NextApiResponse } from 'next';

import initDb from 'utils/planet-scale';

export default async function clearGuestData(_: any, res: NextApiResponse) {
  const db = initDb();

  const guestWidgets = (
    // eslint-disable-next-line max-len
    await db.execute('SELECT id FROM PriceWidget WHERE userId LIKE \'guest_%\'')
  ).rows as { id: string }[];

  const ids = guestWidgets.map((w) => w.id);

  await db.transaction(async (tx) => {
    await tx.execute('DELETE FROM `pricing-tables`.Product WHERE Product.widgetId IN (?)', [ids]);
    await tx.execute('DELETE FROM `pricing-tables`.Price WHERE Price.widgetId IN (?)', [ids]);
    await tx.execute('DELETE FROM `pricing-tables`.Feature WHERE Feature.widgetId IN (?)', [ids]);
    await tx.execute('DELETE FROM `pricing-tables`.Callback WHERE Callback.widgetId IN (?)', [ids]);
    await tx.execute('DELETE FROM `pricing-tables`.PriceWidget WHERE PriceWidget.id IN (?)', [ids]);
  });

  res.status(200).json({ success: true });
}
