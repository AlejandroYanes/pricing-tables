'use client';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@dealo/ui';

import BaseLayout from 'components/BaseLayout';
import PricingWidget from 'components/PricingWidget';

const PricingPage = () => {
  const { data, status } = useSession();
  const user = data?.user;

  useEffect(() => {
    import('@dealo/pricing-cards');
  }, []);

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <>
        <Head>
          <title>Dealo | Pricing</title>
        </Head>
        <BaseLayout hideUserControls showBackButton backRoute="/">
          <div className="flex flex-col items-center justify-center mx-auto h-[calc(100vh - 88px)]">
            <div className="flex flex-row items-center justify-center">
              <div className="flex flex-row">
                <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64}/>
                <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
              </div>
            </div>
            <span className="text text-xl text-center mb-16">
              Pick a plan to start using Dealo, you can cancel at any time.
            </span>
            <PricingWidget />
          </div>
        </BaseLayout>
      </>
    );
  }

  if (user && user.hasSubscription) {
    return (
      <>
        <Head>
          <title>Dealo | Pricing</title>
        </Head>
        <BaseLayout hideUserControls showBackButton>
          <div className="flex flex-col items-center justify-center gap-6 mt-[48px] mx-auto h-[calc(100vh - 88px)]">
            <h1 className="text text-2xl">Hi {user.name}</h1>
            <span className="text">You already have a subscription with us, if you want to check:</span>
            <Link href="/api/stripe/customer/portal">
              <Button>Got to the Customer Portal</Button>
            </Link>
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Pricing</title>
      </Head>
      <BaseLayout hideUserControls showBackButton={!!user} title="Pick a plan">
        <div className="flex flex-col items-center justify-center mx-auto h-[calc(100vh - 88px)]">
          <PricingWidget />
        </div>
      </BaseLayout>
    </>
  );
};

export default PricingPage;
