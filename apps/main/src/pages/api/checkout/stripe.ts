import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { env } from 'env/server.mjs';
import initDb from 'utils/planet-scale';
import { cuidZodValidator } from 'utils/validations';
import initStripe, { guestStripeKey } from 'utils/stripe';

type SessionQuery = {
  productId: string;
  priceId: string;
  userId: string;
  successUrl: string | null;
  cancelUrl: string | null;
}

const inputSchema = z.object({
  widget_id: z.string().cuid(),
  product_id: cuidZodValidator,
  price_id: cuidZodValidator,
  currency: z.string().length(3),
  email: z.string().email().optional(),
  disable_email: z.boolean().optional(),
});

export default async function createStripeCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  const parsedBody = inputSchema.safeParse(req.query);

  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error });
    return;
  }

  const fallbackUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXTAUTH_URL;

  const { widget_id: widgetId, product_id: prodMask, price_id: priceMask } = parsedBody.data;
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

    const isGuest = userId.startsWith('guest_');
    let stripeKey = guestStripeKey;

    if (!isGuest) {
      const user = (
        await db.execute(
          `SELECT stripeKey FROM User WHERE id = ?`,
          [userId],
        )
      ).rows[0] as { stripeKey: string };

      stripeKey = user.stripeKey;
    }

    const refererSuccessUrl = req.headers['referer'] ? `${req.headers['referer']}?payment_status=success` : undefined;
    const refererCancelUrl = req.headers['referer'] ? `${req.headers['referer']}?payment_status=canceled` : undefined;

    const fallbackSuccessUrl = `${fallbackUrl}/checkout/success`;
    const fallbackCancelUrl = `${fallbackUrl}/checkout/cancel`;

    const finalSuccessUrl = successUrl || refererSuccessUrl || fallbackSuccessUrl;
    const finalCancelUrl = cancelUrl || refererCancelUrl || fallbackCancelUrl;

    const stripe = initStripe(stripeKey);

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
    });

    if (!checkoutSession.url) {
      res.redirect(303, `${fallbackUrl}/checkout/error?status=checkout_session_url_not_found`);
      return;
    }

    res.redirect(303, checkoutSession.url);
  } catch (err) {
    res.redirect(303, `${fallbackUrl}/checkout/error`);
  }
}
