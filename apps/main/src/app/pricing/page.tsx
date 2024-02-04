import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Button } from '@dealo/ui';

import { authOptions } from 'utils/auth';
import BaseLayout from 'components/base-layout';
import PricingWidget from 'components/pricing-widget';
import ClientProviders from 'components/client-providers';

export const metadata: Metadata = {
  title: 'Dealo | Pricing',
  description: 'Pick a plan to start using Dealo, you can cancel at any time.',
}

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/signin');
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
