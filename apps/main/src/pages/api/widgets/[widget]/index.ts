/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import type Stripe from 'stripe';
import type { FormFeature, FormProduct } from 'models';

import initDb from 'utils/planet-scale';
import initStripe, { reduceStripePrice, reduceStripeProduct } from 'utils/stripe';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  allowedHeaders: ['*'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware to check for CORS
  await runMiddleware(req, res, cors);

  // if CORS is allowed, continue
  const { widget } = req.query;

  if (!widget) {
    res.status(400).json({ error: 'Missing widget parameter' });
  }

  const widgetData = await getWidgetData(widget as string);

  const secondsInADay = 60 * 60 * 24;
  res.setHeader('Cache-Control', `s-maxage=${secondsInADay}, stale-while-revalidate=360`);
  res.status(200).json(widgetData);
}

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
    await db.execute('SELECT `pricing-tables`.`Product`.`id`, `pricing-tables`.`Product`.`isCustom`, `pricing-tables`.`Product`.`name`, `pricing-tables`.`Product`.`description`, `pricing-tables`.`Product`.`ctaLabel`, `pricing-tables`.`Product`.`ctaUrl` FROM `pricing-tables`.`Product` WHERE `pricing-tables`.`Product`.`widgetId` = ? ORDER BY `pricing-tables`.`Product`.`createdAt`', [widgetId])
  ).rows as Product[];

  const prodIds = products.map((p) => p.id);
  const prices = (
    await db.execute('SELECT `pricing-tables`.`Price`.`id`, `pricing-tables`.`Price`.`hasFreeTrial`, `pricing-tables`.`Price`.`freeTrialDays`, `pricing-tables`.`Price`.`productId` FROM `pricing-tables`.`Price` WHERE `pricing-tables`.`Price`.`widgetId` = ? AND `pricing-tables`.`Price`.`productId` IN (?) ORDER BY `pricing-tables`.`Price`.`createdAt`', [widgetId, prodIds])
  ).rows as Price[];

  const widgetUser = (
    await db.execute('SELECT `pricing-tables`.`User`.`stripeKey` FROM `pricing-tables`.`User` WHERE `pricing-tables`.`User`.`id` = ?', [widget.userId])
  ).rows[0] as { stripeKey: string };

  const stripe = initStripe(widgetUser.stripeKey);

  return {
    color: widget.color,
    callbacks: callbacks,
    recommended: widget.recommended,
    subscribeLabel: widget.subscribeLabel,
    freeTrialLabel: widget.freeTrialLabel,
    unitLabel: widget.unitLabel,
    currency: widget.currency,
    products: await normaliseProducts(stripe, products, prices),
    features: normaliseFeatures(features),
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
        widgetProd = Object.assign(widgetProd, stripeProd, { prices: widgetPrices });

        for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
          let widgetPrice = prices[priceIndex]!;
          const stripePrice = stripePrices.find((p) => p.id === widgetPrice.id);
          widgetPrice = Object.assign(widgetPrice, stripePrice);
        }
      }

      finalProducts.push(widgetProd as any);
    }

    return finalProducts;
  }

  return [] as FormProduct[];
}

function normaliseFeatures(features: Feature[]) {
  return features.reduce((acc: FormFeature[], feature) => {
    const existing = acc.find((f) => f.id === feature.id);
    if (existing) {
      existing.products.push({ id: feature.productId, value: feature.value });
    } else {
      acc.push({
        id: feature.id,
        name: feature.name,
        type: feature.type as any,
        products: [{ id: feature.productId, value: feature.value }],
      });
    }
    return acc;
  }, [] as FormFeature[]);
}

type Widget = { id: string; template: string; recommended: string; color: string; currency: string; unitLabel: string; subscribeLabel: string; freeTrialLabel: string; userId: string }
type Callback = { env: string; url: string };
type Feature = { id: string; name: string; type: string; value: string; productId: string };
type Product = { id: string; isCustom: boolean; name: string; description: string; ctaLabel: string; ctaUrl: string };
type Price = { id: string; hasFreeTrial: boolean; freeTrialDays: number; productId: string };
