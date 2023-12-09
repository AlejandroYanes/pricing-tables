import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import initStripe from 'utils/stripe';

type SessionQuery = {
  productId: string;
  priceId: string;
  userId: string;
  successUrl: string | null;
  cancelUrl: string | null;
}

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: z.string().cuid2(),
  price_id: z.string().cuid2(),
  currency: z.string().length(3),
  email: z.string().email().optional(),
  disable_email: z.boolean().optional(),
  payment_type: z.literal('one_time').or(z.literal('recurring')),
});

export default async function createStripeCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  const parsedBody = inputSchema.safeParse(req.query);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }
  const platformUrl = process.env.PLATFORM_URL ?? env.NEXTAUTH_URL;

  const { widget_id: widgetId, product_id: prodMask, price_id: priceMask, payment_type, email, currency } = parsedBody.data;
  const db = initDb();

  try {
    const sessionQuery = (
      await db.execute(
        `SELECT
            PW.checkoutSuccessUrl as successUrl,
            PW.checkoutCancelUrl as cancelUrl,
            PW.userId,
            PROD.id as productId,
            PRI.id as priceId
         FROM
            PriceWidget PW JOIN Product PROD on PW.id = PROD.widgetId
                JOIN Price PRI on PRI.widgetId = PW.id
        WHERE PW.id = ? AND PROD.mask = ? AND PRI.mask = ?`,
        [widgetId, prodMask, priceMask],
      )
    ).rows[0] as SessionQuery;

    const { priceId, userId, successUrl, cancelUrl  } = sessionQuery;

    const user = (
      await db.execute(
        `SELECT stripeAccount FROM User WHERE id = ?`,
        [userId],
      )
    ).rows[0] as { stripeAccount: string };

    const refererSuccessUrl = req.headers['referer'] ? `${req.headers['referer']}?payment_status=success` : undefined;
    const refererCancelUrl = req.headers['referer'] ? `${req.headers['referer']}?payment_status=cancelled` : undefined;

    const fallbackSuccessUrl = `${platformUrl}/checkout/success`;
    const fallbackCancelUrl = `${platformUrl}/checkout/cancelled`;

    const finalSuccessUrl = successUrl || refererSuccessUrl || fallbackSuccessUrl;
    const finalCancelUrl = cancelUrl || refererCancelUrl || fallbackCancelUrl;

    const stripe = initStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: payment_type === 'one_time' ? 'payment' : 'subscription',
      customer_email: email,
      currency,
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
    }, { stripeAccount: user.stripeAccount });

    if (!checkoutSession.url) {
      res.redirect(303, `${platformUrl}/checkout/error?status=checkout_session_url_not_found`);
      return;
    }

    res.redirect(303, checkoutSession.url);
  } catch (err) {
    res.redirect(303, `${platformUrl}/checkout/error?status=internal_error`);
  }
}
