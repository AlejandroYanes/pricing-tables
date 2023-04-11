/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import type { FormFeature, FormProduct } from 'models';

import initDb from 'utils/planet-scale';
import initStripe, { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';
import { corsMiddleware } from 'utils/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { widget } = req.query;

  if (!widget) {
    res.status(400).json({ error: 'Missing widget parameter' });
  }

  const widgetData = await getWidgetData(widget as string);

  const secondsInADay = 60 * 60 * 24;
  res.setHeader('Cache-Control', `s-maxage=${secondsInADay}, stale-while-revalidate=360`);
  res.status(200).json(widgetData);
}

export default corsMiddleware(handler);

async function getWidgetData(widgetId: string) {
  const db = initDb();

  const widgetFields = [
    '`pricing-tables`.`PriceWidget`.`id`',
    '`pricing-tables`.`PriceWidget`.`template`',
    '`pricing-tables`.`PriceWidget`.`recommended`',
    '`pricing-tables`.`PriceWidget`.`color`',
    '`pricing-tables`.`PriceWidget`.`currency`',
    '`pricing-tables`.`PriceWidget`.`unitLabel`',
    '`pricing-tables`.`PriceWidget`.`subscribeLabel`',
    '`pricing-tables`.`PriceWidget`.`freeTrialLabel`',
    '`pricing-tables`.`PriceWidget`.`userId`',
  ];
  const widget = (
    await db.execute(`SELECT ${widgetFields.join(', ')} FROM \`pricing-tables\`.\`PriceWidget\` WHERE \`id\` = ?`, [widgetId])
  ).rows[0] as Widget;

  const callbacks = (
    await db.execute('SELECT `pricing-tables`.`Callback`.`env`, `pricing-tables`.`Callback`.`url` FROM `pricing-tables`.`Callback` WHERE `pricing-tables`.`Callback`.`widgetId` = ? ORDER BY `pricing-tables`.`Callback`.`createdAt`', [widgetId])
  ).rows as Callback[];

  const features = (
    await db.execute('SELECT `pricing-tables`.`Feature`.`id`, `pricing-tables`.`Feature`.`name`, `pricing-tables`.`Feature`.`type`, `pricing-tables`.`Feature`.`value`, `pricing-tables`.`Feature`.`productId` FROM `pricing-tables`.`Feature` WHERE `pricing-tables`.`Feature`.`widgetId` = ? ORDER BY `pricing-tables`.`Feature`.`createdAt`', [widgetId])
  ).rows as Feature[];

  const products = (
    await db.execute('SELECT `pricing-tables`.`Product`.`id`, `pricing-tables`.`Product`.`isCustom`, `pricing-tables`.`Product`.`name`, `pricing-tables`.`Product`.`description`, `pricing-tables`.`Product`.`ctaLabel`, `pricing-tables`.`Product`.`ctaUrl`, `pricing-tables`.`Product`.`mask` FROM `pricing-tables`.`Product` WHERE `pricing-tables`.`Product`.`widgetId` = ? ORDER BY `pricing-tables`.`Product`.`createdAt`', [widgetId])
  ).rows as Product[];

  const prodIds = products.map((p) => p.id);
  const prices = (
    await db.execute('SELECT `pricing-tables`.`Price`.`id`, `pricing-tables`.`Price`.`hasFreeTrial`, `pricing-tables`.`Price`.`freeTrialDays`, `pricing-tables`.`Price`.`productId`, `pricing-tables`.`Price`.`mask` FROM `pricing-tables`.`Price` WHERE `pricing-tables`.`Price`.`widgetId` = ? AND `pricing-tables`.`Price`.`productId` IN (?) ORDER BY `pricing-tables`.`Price`.`createdAt`', [widgetId, prodIds])
  ).rows as Price[];

  const widgetUser = (
    await db.execute('SELECT `pricing-tables`.`User`.`stripeKey` FROM `pricing-tables`.`User` WHERE `pricing-tables`.`User`.`id` = ?', [widget.userId])
  ).rows[0] as { stripeKey: string };

  const stripe = initStripe(widgetUser.stripeKey);
  const maskedRecommended = products.find((p) => p.id === widget.recommended)!.mask;

  return {
    color: widget.color,
    callbacks: callbacks,
    recommended: maskedRecommended,
    subscribeLabel: widget.subscribeLabel,
    freeTrialLabel: widget.freeTrialLabel,
    unitLabel: widget.unitLabel,
    currency: widget.currency,
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
      let widgetProd = products[pIndex]!;
      const stripeProd = stripeProducts.find((p) => p.id === widgetProd.id)!;

      if (!widgetProd.isCustom) {
        const widgetPrices = prices.filter((p) => p.productId === widgetProd.id);
        widgetProd = Object.assign(
          widgetProd,
          stripeProd,
          { id: widgetProd.mask, prices: widgetPrices, mask: undefined, default_price: undefined },
        );

        for (let priceIndex = 0; priceIndex < widgetPrices.length; priceIndex++) {
          const widgetPrice = widgetPrices[priceIndex]!;
          const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id);
          widgetPrices[priceIndex] = {
            ...widgetPrice,
            ...stripePrice,
            ...({
              id: widgetPrice.mask,
              productId: widgetProd.id,
              mask: undefined,
              product: undefined,
            }),
          } as any;
        }
      }

      finalProducts.push(widgetProd as any);
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
        products: [{ id: existingProduct.mask, value: feature.value }],
      });
    }
    return acc;
  }, [] as FormFeature[]);
}

type Widget = { id: string; template: string; recommended: string; color: string; currency: string; unitLabel: string; subscribeLabel: string; freeTrialLabel: string; userId: string }
type Callback = { env: string; url: string };
type Feature = { id: string; name: string; type: string; value: string; productId: string };
type Product = { id: string; isCustom: boolean; name: string; description: string; ctaLabel: string; ctaUrl: string; mask: string };
type Price = { id: string; hasFreeTrial: boolean; freeTrialDays: number; productId: string; mask: string };