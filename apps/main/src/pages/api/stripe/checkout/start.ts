import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

import { env } from 'env/server.mjs';
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
  payment_type: z.literal('one_time').or(z.literal('recurring')),
  email: z.string().email().optional(),
  customer_id: z.string().optional(),
  internal_flow: z.enum(['true', 'false']).optional(),
  free_trial_days: z.preprocess((val) => Number(val), z.number().int().positive().min(3)).optional(),
  free_trial_end_action: z.literal('pause').or(z.literal('cancel')).optional(),
});

export default async function createStripeCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  const parsedParams = inputSchema.safeParse(req.query);

  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error });
    return;
  }
  const platformUrl = process.env.PLATFORM_URL ?? env.NEXTAUTH_URL;

  const {
    widget_id: widgetId,
    product_id: prodMask,
    price_id: priceMask,
    payment_type,
    currency,
    email,
    customer_id,
    internal_flow,
    free_trial_days,
    free_trial_end_action,
  } = parsedParams.data;

  const client = await sql.connect();

  try {
    const sessionQuery = (
      await client.sql<SessionQuery>`
      SELECT
            PW."checkoutSuccessUrl" as successUrl,
            PW."checkoutCancelUrl" as cancelUrl,
            PW."userId",
            PROD.id as productId,
            PRI.id as priceId
         FROM
            "PriceWidget" PW JOIN "Product" PROD on PW.id = PROD."widgetId"
                JOIN "Price" PRI on PRI."widgetId" = PW.id
        WHERE PW.id = ${widgetId} AND PROD.mask = ${prodMask} AND PRI.mask = ${priceMask}`
    ).rows[0]!;

    const { priceId, userId, successUrl, cancelUrl  } = sessionQuery;

    const user = (
      await client.sql<{ stripeAccount: string }>`SELECT "stripeAccount" FROM "User" WHERE id = ${userId}`
    ).rows[0]!;

    client.release();

    const referer = req.headers['referer'];
    let refererSuccessUrl;
    let refererCancelUrl;

    if (referer) {
      const hasQueryParams = referer.includes('?');
      refererSuccessUrl = hasQueryParams
        ? `${referer}&payment_status=success${free_trial_days ? '&free-trial=true' : ''}`
        : `${referer}?payment_status=success${free_trial_days ? '&free-trial=true' : ''}`;
      refererCancelUrl = hasQueryParams ? `${referer}&payment_status=cancelled` : `${referer}?payment_status=cancelled`;
    }

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
      ...(free_trial_days ? ({
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: free_trial_end_action ?? 'pause',
            },
          },
          trial_period_days: free_trial_days,
        },
        payment_method_collection: 'if_required',
      }) : {}),
      customer_email: customer_id ? undefined : email,
      customer: customer_id,
      currency: currency || 'gbp',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        source: 'dealo',
        internal_flow: internal_flow ? 'true' : 'false',
        widgetId,
        productId: sessionQuery.productId,
        priceId: sessionQuery.priceId,
      },
    }, { stripeAccount: user.stripeAccount });

    if (!checkoutSession.url) {
      res.redirect(303, `${platformUrl}/checkout/error?status=checkout_session_url_not_found`);
      return;
    }

    res.redirect(303, checkoutSession.url);
  } catch (err) {
    console.log('❌ Stripe Checkout error:', err);
    res.redirect(303, `${platformUrl}/checkout/error?status=internal_error`);
  }
}
