import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import initDb from 'utils/planet-scale';
import { notifyOfNewSetup } from 'utils/slack';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event: Stripe.Event = req.body;

  if (event.type === 'account.updated') {
    const { id, charges_enabled } = event.data.object as Stripe.Account;

    if (charges_enabled) {
      const db = initDb();
      await db.transaction(async (tx) => {
        await tx.execute('UPDATE `pricing-tables`.`User` SET `stripeConnected` = true, `stripeKey` = null WHERE `stripeAccount` = ?', [id]);
        await tx.execute(`
        DELETE pw, prod, price, cb, ft
        FROM
        \`pricing-tables\`.\`PriceWidget\` pw INNER JOIN \`pricing-tables\`.\`Product\` prod ON pw.id = prod.widgetId
        INNER JOIN \`pricing-tables\`.\`Price\` price ON pw.id = price.widgetId
        INNER JOIN \`pricing-tables\`.\`Callback\` cb ON pw.id = cb.widgetId
        INNER JOIN \`pricing-tables\`.\`Feature\` ft ON pw.id = ft.widgetId
        INNER JOIN \`pricing-tables\`.\`User\` usr ON pw.userId = usr.id
        WHERE usr.stripeAccount=?`, [id]);
      });
      const { name } = (
        await db.execute('SELECT name FROM `pricing-tables`.`User` WHERE `stripeAccount` = ?', [id])
      ).rows[0] as { name: string };
      notifyOfNewSetup({ name });
    }
  }

  res.status(200).json({ received: true });
}
