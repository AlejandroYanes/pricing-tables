/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import type Stripe from 'stripe';
import { z } from 'zod';
import type { FeatureType, FormFeature, FormProduct, WidgetInfo } from '@dealo/models';

import { authMiddleware } from 'utils/api';
import initStripe, { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';

const inputSchema = z.object({
  widget: z.string().cuid(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!inputSchema.safeParse(req.query).success) {
    res.status(400).json({ error: 'Invalid widget parameter' });
    return;
  }

  const { widget } = req.query;
  const widgetData: WidgetInfo = await getWidgetData(widget as string);

  res.status(200).json(widgetData);
}

export default authMiddleware(handler);

async function getWidgetData(widgetId: string) {
  const widget = (
    await sql`
        SELECT id, template, name, recommended, color, "unitLabel", "subscribeLabel", "freeTrialLabel", "userId", "checkoutSuccessUrl", "checkoutCancelUrl"
        FROM "PriceWidget" WHERE id = ${widgetId}`
  ).rows[0] as Widget;

  const callbacks = (
    await sql<Callback>`
      SELECT id, env, url, "order"
      FROM "Callback"
      WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const features = (
    await sql<Feature>`
      SELECT id, name, type, value, "productId", "order"
      FROM "Feature" WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const products = (
    await sql<Product>`
      SELECT id, "isCustom", name, description, "ctaLabel", "ctaUrl", mask, "order"
      FROM "Product" WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const prodIds = products.map((p) => p.id);
  let prices: Price[] = [];

  if (prodIds.length) {
    const prodIdsStr = `${prodIds.map((_, i) => `$${i + 1}`).join(',')}`;
    prices = (
      await sql.query<Price>(`
        SELECT id, "hasFreeTrial", "freeTrialDays", "freeTrialEndAction", "productId", mask, "order"
        FROM "Price" WHERE "widgetId" = $${prodIds.length + 1} AND "productId" IN (${prodIdsStr})
        ORDER BY "order", "createdAt"`, [...prodIds, widgetId])
    ).rows;
  }

  const widgetUser = (
    await sql<{ stripeAccount: string }>`SELECT "stripeAccount" FROM "User" WHERE id = ${widget.userId}`
  ).rows[0]!;

  const stripe = initStripe();

  return {
    id: widget.id,
    name: widget.name,
    template: widget.template,
    color: widget.color,
    callbacks: callbacks,
    recommended: widget.recommended,
    subscribeLabel: widget.subscribeLabel,
    freeTrialLabel: widget.freeTrialLabel,
    unitLabel: widget.unitLabel,
    successUrl: widget.checkoutSuccessUrl,
    cancelUrl: widget.checkoutCancelUrl,
    products: await normaliseProducts(stripe, widgetUser.stripeAccount, products, prices),
    features: normaliseFeatures(features, products),
  };
}

async function normaliseProducts(stripe: Stripe, stripeAccount: string, products: Product[], prices: Price[]) {
  if (products!.length > 0) {
    const stripeProducts: FormProduct[] = (
      await stripe.products.list({
        ids: products!.filter((prod) => !prod.isCustom).map((prod) => prod.id),
      }, { stripeAccount })
    ).data.map(reduceStripeProduct);

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const stripePrices = (
      await stripe.prices.search({
        query: `${pricesQuery}`,
        expand: ['data.tiers', 'data.currency_options'],
        limit: 50,
      }, { stripeAccount })
    ).data.map(reduceStripePrice);

    const finalProducts: FormProduct[] = [];

    for (let pIndex = 0; pIndex < products.length; pIndex++) {
      const widgetProd = products[pIndex]!;
      const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id);

      if (stripeProd && !stripeProd.active) continue;

      let finalProduct: FormProduct = {
        ...widgetProd,
        isCustom: !!widgetProd.isCustom,
        active: true,
        prices: [],
      };

      if (!widgetProd.isCustom) {
        const widgetPrices = prices.filter((p) => p.productId === widgetProd.id);
        finalProduct = {
          ...finalProduct,
          ...stripeProd,
          ...({
            prices: [],
            default_price: undefined,
          }),
        };

        stripePrices
          // TODO: remove the tier filter once we support tiers (DEV-14)
          .filter((stripePrice) => stripePrice.product === widgetProd.id && stripePrice.billing_scheme !== 'tiered')
          .forEach(stripePrice => {
            if (!stripePrice.active) return;

            const widgetCurrentPrice = widgetPrices.find((p) => p.id === stripePrice.id);
            const widgetPrice = widgetCurrentPrice
              ? {
                ...widgetCurrentPrice,
                isSelected: true,
              }
              : {
                hasFreeTrial: 0,
                freeTrialDays: 0,
                productId: '',
                mask: '',
                order: Number.MAX_VALUE,
                isSelected: false,
              };

            finalProduct.prices.push({
              ...widgetPrice,
              ...stripePrice,
              hasFreeTrial: !!widgetPrice.hasFreeTrial,
              ...({
                productId: widgetProd.id,
                product: undefined as any,
              }),
            });
          });
      }

      finalProduct.prices.sort((a, b) => a.order - b.order);
      finalProducts.push(finalProduct);
    }

    return finalProducts;
  }

  return [] as FormProduct[];
}

function normaliseFeatures(features: Feature[], products: Product[]) {
  return features.reduce((acc: FormFeature[], feature) => {
    const featureInList = acc.find((f) => f.id === feature.id);
    const existingProduct = products.find((p) => p.id === feature.productId)!;
    if (featureInList) {
      featureInList.products.push({ id: existingProduct.id, value: feature.value });
    } else {
      acc.push({
        id: feature.id,
        name: feature.name,
        type: feature.type as FeatureType,
        order: feature.order,
        products: [{ id: existingProduct.id, value: feature.value }],
      });
    }
    return acc;
  }, [] as FormFeature[]);
}

type Widget = {
  id: string;
  name: string;
  template: string;
  recommended: string | null;
  color: string;
  unitLabel: string | null;
  subscribeLabel: string;
  freeTrialLabel: string;
  userId: string;
  checkoutSuccessUrl: string | null;
  checkoutCancelUrl: string | null;
};
type Callback = { id: string; env: string; url: string; order: number };
type Feature = { id: string; name: string; type: string; value: string; productId: string; order: number };
type Product = { id: string; isCustom: number; name: string; description: string; ctaLabel: string; ctaUrl: string; mask: string; order: number };
type Price = { id: string; hasFreeTrial: number; freeTrialDays: number; freeTrialEndAction: string; productId: string; mask: string; order: number; isSelected: boolean };
