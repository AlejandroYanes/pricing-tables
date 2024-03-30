'use client';
import { useEffect } from 'react';
import { TEMPLATE_IDS } from '@dealo/templates';

import { env as clientEnv } from 'env/client.mjs';

const PRODUCTION_WIDGET = 'cluef3tpo0001wy61gaj0tz99';
const DEVELOPMENT_WIDGET = 'clueevzsv0003vblzv1t88uim';

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
      <pricing-cards widget={widget} internal="true" template={TEMPLATE_IDS.SECOND} items={2} />
    </>
  );
}

export default PricingWidget;
