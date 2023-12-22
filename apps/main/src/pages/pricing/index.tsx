import { useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useColorScheme } from '@mantine/hooks';

import BaseLayout from 'components/BaseLayout';
import { Stack } from '@mantine/core';

const PricingPage = () => {
  const { data } = useSession();
  const user = data?.user;

  const colorScheme = useColorScheme();

  useEffect(() => {
    import('pricing-cards');
  }, []);

  return (
    <>
      <Head>
        <title>Dealo | Pricing</title>
      </Head>
      <BaseLayout hideUserControls showBackButton={!!user} backRoute="/dashboard" title="Pick a plan">
        <Stack justify="center" align="center" style={{ margin: '0 auto', height: 'calc(100vh - 88px)' }}>
          {/* @ts-ignore */}
          <pricing-cards widget="clpy5czwo0001hin5sqyyfhz4" theme={colorScheme} internal="true" />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default PricingPage;
