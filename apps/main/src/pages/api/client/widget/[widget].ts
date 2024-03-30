/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import { sql, type VercelPoolClient } from '@vercel/postgres';
import type Stripe from 'stripe';
import type { FormFeature, FormProduct } from '@dealo/models';
import { z } from 'zod';

import { corsMiddleware } from 'utils/api';
import initStripe, { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';

const inputSchema = z.object({
  widget: z.string().cuid(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!inputSchema.safeParse(req.query).success) {
    res.status(400).json({ error: 'Invalid widget parameter' });
    return;
  }

  const widgetId = req.query.widget as string;
  const client = await sql.connect();

  try {
    const widgetData = await getWidgetData(client, widgetId);
    client.release();

    const seconds = 60;
    res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=360`);
    res.status(200).json(widgetData);
  } catch (e: any) {
    client.release();
    console.error(`❌ Error fetching data for widget: ${widgetId}`, e);
    res.status(400).json({ error: `❌ Error fetching data for widget: ${widgetId}` });
  }
}

export default corsMiddleware(handler);

async function getWidgetData(client: VercelPoolClient, widgetId: string): Promise<WidgetInfo> {
  const widget = (
    await client.sql<Widget>`
      SELECT id, template, recommended, color, "unitLabel", "subscribeLabel", "freeTrialLabel", "userId"
      FROM "PriceWidget" WHERE id = ${widgetId}`
  ).rows[0];

  if (!widget) {
    throw new Error('Widget not found');
  }

  const callbacks = (
    await client.sql<Callback>`SELECT env, url FROM "Callback" WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const features = (
    await client.sql<Feature>`
      SELECT id, name, type, value, "productId"
      FROM "Feature" WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const products = (
    await client.sql<Product>`
      SELECT id, "isCustom", name, description, "ctaLabel", "ctaUrl", mask
      FROM "Product" WHERE "widgetId" = ${widgetId} ORDER BY "order", "createdAt"`
  ).rows;

  const prodIds = products.map((p) => p.id);
  const prodIdsStr = `${prodIds.map((_, i) => `$${i + 1}`).join(',')}`;
  const prices = (
    await client.query<Price>(`
      SELECT id, "hasFreeTrial", "freeTrialDays", "freeTrialEndAction", "productId", mask
      FROM "Price" WHERE "widgetId" = $${prodIds.length + 1} AND "productId" IN (${prodIdsStr})
      ORDER BY "order", "createdAt"`, [...prodIds, widgetId])
  ).rows;

  const widgetUser = (
    await client.sql`SELECT "stripeAccount" FROM "User" WHERE id = ${widget.userId}`
  ).rows[0] as { stripeAccount: string; role: string };

  const stripe = initStripe();
  const maskedRecommended = products.find((p) => p.id === widget.recommended)?.mask;

  return {
    template: widget.template,
    color: widget.color,
    callbacks: callbacks,
    recommended: maskedRecommended || null,
    subscribeLabel: widget.subscribeLabel,
    freeTrialLabel: widget.freeTrialLabel,
    unitLabel: widget.unitLabel,
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
      const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id)!;

      if (stripeProd && !stripeProd.active) continue;

      let finalProduct: FormProduct = {
        ...widgetProd,
        id: widgetProd.mask,
        mask: '',
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
            id: widgetProd.mask,
            mask: '',
            prices: [],
            default_price: undefined,
          }),
        };

        for (let priceIndex = 0; priceIndex < widgetPrices.length; priceIndex++) {
          const widgetPrice = widgetPrices[priceIndex]!;
          const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id)!;

          if (!stripePrice.active) continue;

          finalProduct.prices.push({
            ...widgetPrice,
            ...stripePrice,
            ...({
              id: widgetPrice.mask,
              productId: widgetProd.id,
              hasFreeTrial: !!widgetPrice.hasFreeTrial,
              isSelected: true,
              mask: '',
              product: undefined as any,
            }),
          });
        }
      }

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
      featureInList.products.push({ id: existingProduct.mask, value: feature.value });
    } else {
      acc.push({
        id: feature.id,
        name: feature.name,
        type: feature.type as any,
        order: feature.order,
        products: [{ id: existingProduct.mask, value: feature.value }],
      });
    }
    return acc;
  }, [] as FormFeature[]);
}

type Widget = { id: string; template: string; recommended: string | null; color: string; unitLabel: string; subscribeLabel: string; freeTrialLabel: string; userId: string }
type Callback = { env: string; url: string };
type Feature = { id: string; name: string; type: string; value: string; productId: string; order: number };
type Product = { id: string; isCustom: number; name: string; description: string; ctaLabel: string; ctaUrl: string; mask: string; order: number };
type Price = { id: string; hasFreeTrial: number; freeTrialDays: number; freeTrialEndAction: string; productId: string; mask: string; order: number };

type WidgetInfo = {
  template: string;
  recommended: string | null;
  color: string;
  unitLabel: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  products: FormProduct[];
  features: FormFeature[];
  callbacks: Callback[];
}
