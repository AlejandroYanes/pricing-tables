/* eslint-disable max-len */
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle, Button, cn } from '@dealo/ui';
import { generateQueryString } from '@dealo/helpers';

import { authOptions } from 'utils/auth';
import BaseLayout from 'components/base-layout';
import SignInForm from 'components/signin-form';
import PublicNavbar from 'components/public-navbar';

export const metadata: Metadata = {
  title: 'Dealo | Signin',
  description: 'Signin to Dealo to start using our platform.',
}

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

interface Props {
  searchParams: Record<string, string | null>;
}

export default async function SigninPage(props: Props) {
  const { searchParams } = props;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const hasErrors = !!searchParams.error;
  const errorMessage = errorsMap[searchParams.error as string] || errorsMap.fallback;

  const buildCheckoutUrl = () => {
    const checkoutPageRoute = '/stripe/checkout/start';
    const queryParams = generateQueryString(searchParams);
    return `${checkoutPageRoute}?${queryParams}`;
  }

  if (user) {
    const url = searchParams.internal_flow === 'true' ? buildCheckoutUrl() : '/dashboard';
    redirect(url);
  }

  if (hasErrors) {
    return (
      <BaseLayout
        hideNavbar
        className="px-0"
        footerClassName="w-full max-w-[1200px] mx-auto"
      >
        <PublicNavbar showHome />
        <main className="flex flex-col items-center justify-center max-w-[700px] mt-[180px] mx-auto mb-0">
          <Alert>
            <IconAlertCircle size={16}/>
            <AlertTitle>Hmm...</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            <div className="flex flex-row items-center justify-end mt-6">
              <Link href="/">
                <Button variant="outline">Get back</Button>
              </Link>
            </div>
          </Alert>
        </main>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      hideNavbar
      className="px-0"
      footerClassName="w-full max-w-[1200px] mx-auto"
    >
      <PublicNavbar showHome />
      <main
        data-el="hero-section"
        className={cn(
          'flex flex-col items-center justify-center',
          'md:justify-start md:pt-24 px-4 gap-[72px]',
        )}
      >
        <div className="flex flex-col items-stretch max-w-[30rem]">
          <div className="flex items-center gap-0">
            <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64}/>
            <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
          </div>
          <h2 className="text-[40px] leading-[1.2] font-bold">
            A platform to streamline <br/>
            <span className="relative py-1 px-3 bg-emerald-500/[.15]">pricing</span>
            <br/>
            into your website.
          </h2>
          <span className="mt-4 text-gray-500">
            Build fully functional pricing widgets in minutes using our set of templates.
          </span>
        </div>
        <SignInForm />
      </main>
    </BaseLayout>
  );
}
