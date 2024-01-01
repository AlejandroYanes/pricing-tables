'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Loader } from '@dealo/ui';
import { generateQueryString } from '@dealo/helpers';

import BaseLayout from 'components/BaseLayout';

const CheckoutStartPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  useEffect(() => {
    if (router.query.payment_status === 'cancelled') {
      console.log('❌ Checkout page: Payment cancelled - redirecting to pricing page');
      router.replace('/pricing');
      return;
    }

    if (status === 'authenticated' && router.query.internal_flow === 'true') {
      console.log('✅ Checkout page: User is authenticated - redirecting to checkout');
      const queryString = generateQueryString({
        ...router.query,
        email: data?.user?.email,
        customer_id: data?.user?.customerId,
      });
      router.push(`/api/stripe/checkout/start?${queryString}`);
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout start</title>
      </Head>
      <BaseLayout>
        <div className="flex flex-col items-center justify-center w-full p-[86px]">
          <Loader />
        </div>
      </BaseLayout>
    </>
  );
};

export default CheckoutStartPage;
