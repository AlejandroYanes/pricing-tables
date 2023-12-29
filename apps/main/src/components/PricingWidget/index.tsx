import { useEffect } from 'react';
import { useColorScheme } from '@mantine/hooks';

import { isDevelopment } from 'utils/environments';

const PRODUCTION_WIDGET = 'clqfkamjv0001121ffzdylrd3';
const DEVELOPMENT_WIDGET = 'clpy5czwo0001hin5sqyyfhz4';

const PricingWidget = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    import('pricing-cards');
  }, []);

  const widget = isDevelopment() ? PRODUCTION_WIDGET : DEVELOPMENT_WIDGET;

  return (
    <>
      {/* @ts-ignore */}
      <pricing-cards widget={widget} theme={colorScheme} internal="true" />
    </>
  );
}

export default PricingWidget;
