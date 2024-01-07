'use client';

import { useEffect } from 'react';

import { isDevelopment } from 'utils/environments';

const PRODUCTION_WIDGET = 'clqfkamjv0001121ffzdylrd3';
const DEVELOPMENT_WIDGET = 'clpy5czwo0001hin5sqyyfhz4';

const PricingWidget = () => {

  useEffect(() => {
    import('@dealo/pricing-cards');
  }, []);

  const widget = isDevelopment() ? DEVELOPMENT_WIDGET : PRODUCTION_WIDGET;

  return (
    <>
      {/* @ts-ignore */}
      <pricing-cards widget={widget} internal="true" />
    </>
  );
}

export default PricingWidget;
