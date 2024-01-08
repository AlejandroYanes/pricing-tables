'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Loader } from '@dealo/ui';
import { generateQueryString } from '@dealo/helpers';

import BaseLayout from 'components/BaseLayout';

interface Props {
  searchParams: Record<string, string | string[]>;
}

const CheckoutStartPage = (props: Props) => {
  const { searchParams: query } = props;
  const router = useRouter();
  const { data, status } = useSession();
  useEffect(() => {
    if (query.payment_status === 'cancelled') {
      console.log('❌ Checkout page: Payment cancelled - redirecting to pricing page');
      router.replace('/pricing');
      return;
    }

    if (status === 'authenticated' && query.internal_flow === 'true') {
      console.log('✅ Checkout page: User is authenticated - redirecting to checkout');
      const queryString = generateQueryString({
        ...query,
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
      <BaseLayout hideUserControls>
        <div className="flex flex-col items-center justify-center w-full p-[86px]">
          <Loader />
        </div>
      </BaseLayout>
    </>
  );
};

export default CheckoutStartPage;
