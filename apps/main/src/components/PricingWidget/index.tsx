'use client';

import { useEffect } from 'react';

import { env as clientEnv } from 'env/client.mjs';

const PRODUCTION_WIDGET = 'clqfkamjv0001121ffzdylrd3';
const DEVELOPMENT_WIDGET = 'clpy5czwo0001hin5sqyyfhz4';

export function isLocalhost () {
  return clientEnv.NEXT_PUBLIC_PLATFORM_URL === 'http://localhost:3000';
}

export function isDevelopment() {
  return !clientEnv.NEXT_PUBLIC_PLATFORM_URL || clientEnv.NEXT_PUBLIC_PLATFORM_URL === 'https://dev.dealo.app';
}

const PricingWidget = () => {

  useEffect(() => {
    import('@dealo/pricing-cards');
  }, []);

  const widget = isLocalhost() || isDevelopment() ? DEVELOPMENT_WIDGET : PRODUCTION_WIDGET;

  return (
    <>
      {/* @ts-ignore */}
      <pricing-cards widget={widget} internal="true" />
    </>
  );
}

export default PricingWidget;
