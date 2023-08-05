/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import { z } from 'zod';
import type { FeatureType, FormFeature, FormProduct, WidgetInfo } from '@dealo/models';

import initDb from 'utils/planet-scale';
import { authMiddleware } from 'utils/api';
import initStripe, { guestStripeKey, reduceStripePrice, reduceStripeProduct } from 'utils/stripe';

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
  const db = initDb();

  const widgetFields = [
    '`pricing-tables`.`PriceWidget`.`id`',
    '`pricing-tables`.`PriceWidget`.`template`',
    '`pricing-tables`.`PriceWidget`.`name`',
    '`pricing-tables`.`PriceWidget`.`recommended`',
    '`pricing-tables`.`PriceWidget`.`color`',
    '`pricing-tables`.`PriceWidget`.`unitLabel`',
    '`pricing-tables`.`PriceWidget`.`subscribeLabel`',
    '`pricing-tables`.`PriceWidget`.`freeTrialLabel`',
    '`pricing-tables`.`PriceWidget`.`userId`',
    '`pricing-tables`.`PriceWidget`.`checkoutSuccessUrl`',
    '`pricing-tables`.`PriceWidget`.`checkoutCancelUrl`',
  ];
  const widget = (
    await db.execute(`SELECT ${widgetFields.join(', ')} FROM \`pricing-tables\`.\`PriceWidget\` WHERE \`id\` = ?`, [widgetId])
  ).rows[0] as Widget;

  const callbacks = (
    await db.execute('SELECT `pricing-tables`.`Callback`.`id`, `pricing-tables`.`Callback`.`env`, `pricing-tables`.`Callback`.`url`, `pricing-tables`.`Callback`.`order` FROM `pricing-tables`.`Callback` WHERE `pricing-tables`.`Callback`.`widgetId` = ? ORDER BY `pricing-tables`.`Callback`.`order`, `pricing-tables`.`Callback`.`createdAt`', [widgetId])
  ).rows as Callback[];

  const features = (
    await db.execute('SELECT `pricing-tables`.`Feature`.`id`, `pricing-tables`.`Feature`.`name`, `pricing-tables`.`Feature`.`type`, `pricing-tables`.`Feature`.`value`, `pricing-tables`.`Feature`.`productId`, `pricing-tables`.`Feature`.`order` FROM `pricing-tables`.`Feature` WHERE `pricing-tables`.`Feature`.`widgetId` = ? ORDER BY `pricing-tables`.Feature.order, `pricing-tables`.Feature.createdAt', [widgetId])
  ).rows as Feature[];

  const products = (
    await db.execute('SELECT `pricing-tables`.`Product`.`id`, `pricing-tables`.`Product`.`isCustom`, `pricing-tables`.`Product`.`name`, `pricing-tables`.`Product`.`description`, `pricing-tables`.`Product`.`ctaLabel`, `pricing-tables`.`Product`.`ctaUrl`, `pricing-tables`.`Product`.`mask`, `pricing-tables`.`Product`.`order` FROM `pricing-tables`.`Product` WHERE `pricing-tables`.`Product`.`widgetId` = ? ORDER BY `pricing-tables`.`Product`.`order`, `pricing-tables`.`Product`.`createdAt`', [widgetId])
  ).rows as Product[];

  const prodIds = products.map((p) => p.id);
  const prices = prodIds.length > 0
    ? (
      await db.execute('SELECT `pricing-tables`.`Price`.`id`, `pricing-tables`.`Price`.`hasFreeTrial`, `pricing-tables`.`Price`.`freeTrialDays`, `pricing-tables`.`Price`.`productId`, `pricing-tables`.`Price`.`mask`, `pricing-tables`.`Price`.`order` FROM `pricing-tables`.`Price` WHERE `pricing-tables`.`Price`.`widgetId` = ? AND `pricing-tables`.`Price`.`productId` IN (?) ORDER BY `pricing-tables`.`Price`.`order`, `pricing-tables`.`Price`.`createdAt`', [widgetId, prodIds])
    ).rows as Price[]
    : [];

  const widgetUser = (
    await db.execute('SELECT `pricing-tables`.`User`.`stripeKey` FROM `pricing-tables`.`User` WHERE `pricing-tables`.`User`.`id` = ?', [widget.userId])
  ).rows[0] as { stripeKey: string; role: string };

  const stripeKey = !widgetUser ? guestStripeKey : widgetUser.stripeKey;
  const stripe = initStripe(stripeKey);

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
    products: await normaliseProducts(stripe, products, prices),
    features: normaliseFeatures(features, products),
  };
}

async function normaliseProducts(stripe: Stripe, products: Product[], prices: Price[]) {
  if (products!.length > 0) {
    const stripeProducts: FormProduct[] = (
      await stripe.products.list({
        ids: products!.filter((prod) => !prod.isCustom).map((prod) => prod.id),
      })
    ).data.map(reduceStripeProduct);

    const pricesQuery = products.map((prod) => `product: "${prod.id}"`).join(' OR ');
    const stripePrices = (
      await stripe.prices.search({
        query: `${pricesQuery}`,
        expand: ['data.tiers', 'data.currency_options'],
        limit: 50,
      })
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
          .filter((stripePrice) => stripePrice.product === widgetProd.id)
          .forEach(stripePrice => {
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

            if (stripePrice.active) {
              finalProduct.prices.push({
                ...widgetPrice,
                ...stripePrice,
                hasFreeTrial: !!widgetPrice.hasFreeTrial,
                ...({
                  productId: widgetProd.id,
                  product: undefined as any,
                }),
              });
            }
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
type Price = { id: string; hasFreeTrial: number; freeTrialDays: number; productId: string; mask: string; order: number; isSelected: boolean };
