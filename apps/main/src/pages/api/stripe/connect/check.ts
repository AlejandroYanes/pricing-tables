import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthenticatedSession } from 'next-auth';
import type Stripe from 'stripe';

import initStripe from 'utils/stripe';
import initDb from 'utils/planet-scale';
import { notifyOfNewSetup } from 'utils/slack';
import { sendWelcomeEmail } from 'utils/resend';
import { authMiddleware } from 'utils/api';

async function handler(_: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) {

  const stripe = initStripe();
  const db = initDb();

  const { stripeAccount, stripeConnected } = (
    await db.execute('SELECT stripeAccount, stripeConnected FROM User WHERE id = ?', [session.user.id])
  ).rows[0] as { stripeAccount: string; stripeConnected: boolean };

  if (!stripeAccount) {
    res.status(200).json({ connected: false });
    return;
  }

  if (stripeConnected) {
    res.status(200).json({ connected: true });
    return;
  }

  const account = await stripe.accounts.retrieve(stripeAccount);

  if (account.charges_enabled) {
    const checkoutRecord = (
      await db.execute(
        'SELECT id FROM Subscription WHERE status = ? AND userId = ?',
        ['active' as Stripe.Subscription.Status, session.user.id],
      )
    ).rows[0] as { id: string } | undefined;

    await db.transaction(async (tx) => {
      // eslint-disable-next-line max-len
      await tx.execute('UPDATE User SET stripeConnected = true, stripeKey = null WHERE id = ?', [session.user.id]);
    });

    res.status(200).json({ connected: true });
    // noinspection ES6MissingAwait
    notifyOfNewSetup({ name: session.user.name!, email: session.user.email! });
    // noinspection ES6MissingAwait
    sendWelcomeEmail({
      to: session.user.email!,
      name: session.user.name!,
      withSubscription: !!checkoutRecord,
    });
    return;
  }

  res.status(200).json({ connected: false });
}

export default authMiddleware(handler);
