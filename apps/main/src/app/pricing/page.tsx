import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { Button } from '@dealo/ui';

import { authOptions } from 'utils/auth';
import BaseLayout from 'components/BaseLayout';
import PricingWidget from 'components/PricingWidget';
import { NavbarLink } from 'components/Navbar';

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
        <header className="h-16 flex gap-2 justify-end items-center mb-6 z-10 px-4 md:px-0 w-full max-w-[1200px] mx-auto">
          <Link href="/">
            <NavbarLink label="Home"/>
          </Link>
          <Link href="/pricing">
            <NavbarLink label="Pricing"/>
          </Link>
          <Link href="/#faq-section">
            <NavbarLink label="FAQ"/>
          </Link>
          <Link href="/contact/query">
            <NavbarLink label="Contact Us"/>
          </Link>
          <Link href="/signin">
            <NavbarLink label="Sign in"/>
          </Link>
        </header>
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
      <BaseLayout hideUserControls showBackButton>
        <div className="flex flex-col items-center justify-center gap-6 mt-[48px] mx-auto h-[calc(100vh - 88px)]">
          <h1 className="text text-2xl">Hi {user.name}</h1>
          <span className="text">You already have a subscription with us, if you want to check:</span>
          <Link href="/api/stripe/customer/portal">
            <Button>Got to the Customer Portal</Button>
          </Link>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout hideUserControls showBackButton>
      <div className="flex flex-col items-center justify-center mx-auto h-[calc(100vh - 88px)]">
        <PricingWidget />
      </div>
    </BaseLayout>
  );
}
