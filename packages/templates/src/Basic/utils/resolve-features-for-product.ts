import type { FormFeature } from '@dealo/models';

export const resolveFeaturesForProduct = (features: FormFeature[], productId: string) => {
  return features.reduce((acc, feat) => {
    const targetProduct = feat.products.find((prod) => {
      return prod.id === productId;
    });

    if (targetProduct) {
      let featureLabel: string | undefined;
      switch (feat.type) {
        case 'boolean':
          featureLabel = targetProduct.value === 'true' ? feat.name : undefined;
          break;
        case 'compose':
          featureLabel = `${targetProduct.value} ${feat.name}`;
          break;
        case 'string':
          featureLabel = targetProduct.value as string;
          break;
        default:
          featureLabel = '';
      }

      if (!featureLabel) return acc;

      return acc.concat(featureLabel);
    }

    return acc;
  }, [] as string[]);
};
