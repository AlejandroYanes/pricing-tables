/* eslint-disable max-len */
import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';
import type { FormFeature, FormProduct } from 'models';
import { z } from 'zod';

import initDb from 'utils/planet-scale';
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

  const { widget } = req.query;
  const widgetData: WidgetInfo = await getWidgetData(widget as string);

  const seconds = 60;
  res.setHeader('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate=360`);
  res.status(200).json(widgetData);
}

export default corsMiddleware(handler);

async function getWidgetData(widgetId: string): Promise<WidgetInfo> {
  const db = initDb();

  const widgetFields = [
    'PriceWidget.id',
    'PriceWidget.template',
    'PriceWidget.recommended',
    'PriceWidget.color',
    'PriceWidget.unitLabel',
    'PriceWidget.subscribeLabel',
    'PriceWidget.freeTrialLabel',
    'PriceWidget.userId',
  ];
  const widget = (
    await db.execute(`SELECT ${widgetFields.join(', ')} FROM PriceWidget WHERE id = ?`, [widgetId])
  ).rows[0] as Widget;

  const callbacks = (
    await db.execute('SELECT Callback.env, Callback.url FROM Callback WHERE Callback.widgetId = ? ORDER BY Callback.order, Callback.createdAt', [widgetId])
  ).rows as Callback[];

  const features = (
    await db.execute('SELECT Feature.id, Feature.name, Feature.type, Feature.value, Feature.productId FROM Feature WHERE Feature.widgetId = ? ORDER BY Feature.order, Feature.createdAt', [widgetId])
  ).rows as Feature[];

  const products = (
    await db.execute('SELECT Product.id, Product.isCustom, Product.name, Product.description, Product.ctaLabel, Product.ctaUrl, Product.mask FROM Product WHERE Product.widgetId = ? ORDER BY Product.order, Product.createdAt', [widgetId])
  ).rows as Product[];

  const prodIds = products.map((p) => p.id);
  const prices = (
    await db.execute('SELECT Price.id, Price.hasFreeTrial, Price.freeTrialDays, Price.productId, Price.mask FROM Price WHERE Price.widgetId = ? AND Price.productId IN (?) ORDER BY Price.order, Price.createdAt', [widgetId, prodIds])
  ).rows as Price[];

  const widgetUser = (
    await db.execute('SELECT User.stripeAccount FROM User WHERE User.id = ?', [widget.userId])
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
type Price = { id: string; hasFreeTrial: number; freeTrialDays: number; productId: string; mask: string; order: number };

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
