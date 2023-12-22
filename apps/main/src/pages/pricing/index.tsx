import { useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { generateQueryString } from 'helpers';

import BaseLayout from 'components/BaseLayout';

const PricingPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  console.log('pricing page', status);

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

  const user = data?.user;

  return (
    <>
      <Head>
        <title>Dealo | Pricing</title>
      </Head>
      <BaseLayout showBackButton={!!user} backRoute="/dashboard">
        {/* TODO: show the widget */}
        Pricing page
      </BaseLayout>
    </>
  );
};

export default PricingPage;
