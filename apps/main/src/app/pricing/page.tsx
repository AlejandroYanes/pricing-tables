import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { Button } from '@dealo/ui';

import { authOptions } from 'utils/auth';
import BaseLayout from 'components/base-layout';
import PricingWidget from 'components/pricing-widget';
import ClientProviders from 'components/client-providers';
import PublicNavbar from 'components/public-navbar';

export const metadata: Metadata = {
  title: 'Dealo | Pricing',
  description: 'Pick a plan to start using Dealo, you can cancel at any time.',
}

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return (
      <BaseLayout
        hideNavbar
        className="px-4 md:px-12"
        footerClassName="w-full max-w-[1200px] mx-auto"
      >
        <PublicNavbar showHome />
        <div className="flex flex-col items-center justify-center mx-auto">
          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row">
              <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64}/>
              <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
            </div>
          </div>
          <span className="text text-xl text-center mb-16">
            Pick a plan to start using Dealo, you can cancel at any time.
          </span>
          <PricingWidget/>
        </div>
      </BaseLayout>
    );
  }

  const hasSubscription = (
    user.subscriptionStatus === 'active' ||
    user.subscriptionStatus === 'trialing' ||
    user.subscriptionStatus === 'paused'
  );

  if (hasSubscription) {
    return (
      <ClientProviders session={session}>
        <BaseLayout hideUserControls showBackButton>
          <div className="flex flex-col items-center justify-center gap-6 mt-[48px] mx-auto h-[calc(100vh_-_88px)]">
            <h1 className="text text-2xl">Hi {user.name}</h1>
            <span className="text">You already have a subscription with us, if you want to check:</span>
            <Link href="/api/stripe/customer/portal">
              <Button>Got to the Customer Portal</Button>
            </Link>
          </div>
        </BaseLayout>
      </ClientProviders>
    );
  }

  return (
    <ClientProviders session={session}>
      <BaseLayout hideUserControls showBackButton>
        <div className="flex flex-col items-center justify-center mx-auto h-[calc(100vh_-_88px)]">
          <PricingWidget />
        </div>
      </BaseLayout>
    </ClientProviders>
  );
}
