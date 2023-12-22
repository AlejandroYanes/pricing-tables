import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Loader, Stack } from '@mantine/core';
import { generateQueryString } from 'helpers';

import BaseLayout from 'components/BaseLayout';

const CheckoutStartPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  useEffect(() => {
    if (router.query.payment_status === 'cancelled') {
      console.log('❌ Pricing page: Payment cancelled - redirecting to pricing');
      router.replace('/pricing');
      return;
    }

    if (status === 'authenticated' && router.query.internal_flow === 'true') {
      console.log('✅ Pricing page: User is authenticated - redirecting to checkout');
      const queryString = generateQueryString({ ...router.query, email: data?.user?.email });
      router.push(`/api/stripe/checkout/start?${queryString}`);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Dealo | Stripe Connect results</title>
      </Head>
      <BaseLayout>
        <Stack align="center" justify="center" style={{ width: '100%', padding: '86px' }}>
          <Loader />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default CheckoutStartPage;
