/* eslint-disable max-len */
'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle, Button, Loader } from '@dealo/ui';
import { generateQueryString } from '@dealo/helpers';

import BaseLayout from 'components/BaseLayout';
import SignInForm from 'components/SignInForm';
import RenderWithDelay from 'components/RenderWithDelay';

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

interface Props {
  searchParams: Record<string, string | null>;
}

export default function SigninPage(props: Props) {
  const { searchParams } = props;
  const { status } = useSession();
  const router = useRouter();

  const hasErrors = !!searchParams.error;
  const errorMessage = errorsMap[searchParams.error as string] || errorsMap.fallback;

  const buildCheckoutUrl = () => {
    const checkoutPageRoute = '/stripe/checkout/start';
    const queryParams = generateQueryString(searchParams);
    return `${checkoutPageRoute}?${queryParams}`;
  }

  useEffect(() => {
    if (status === 'authenticated') {
      const url = searchParams.internal_flow === 'true' ? buildCheckoutUrl() : '/dashboard';
      router.push(url);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Dealo | Signin</title>
        </Head>
        <BaseLayout hideUserControls>
          <RenderWithDelay delay={1000}>
            <div className="flex flex-col items-center justify-center max-w-[700px] mt-6 mx-auto mb-0">
              <Loader />
            </div>
          </RenderWithDelay>
        </BaseLayout>
      </>
    );
  }

  if (status === 'authenticated') return null;

  if (hasErrors) {
    return (
      <>
        <Head>
          <title>Dealo | Signin</title>
        </Head>
        <BaseLayout
          hideUserControls
          className="px-0"
          footerClassName="w-full max-w-[1200px] mx-auto"
        >
          <div className="flex flex-col items-center justify-center max-w-[700px] mt-6 mx-auto mb-0">
            <Alert>
              <IconAlertCircle size={16} />
              <AlertTitle>Hm...</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="flex flex-row items-center justify-end mt-6">
              <Link href="/">
                <Button color="gray">Get back</Button>
              </Link>
            </div>
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Signin</title>
      </Head>
      <BaseLayout
        hideUserControls
        showBackButton
        backRoute="/"
        className="px-0 md:px-12"
        footerClassName="w-full max-w-[1200px] mx-auto"
      >
        <div data-el="hero-section" className="flex flex-col items-center justify-center md:justify-start md:pt-24 px-4 gap-[72px] h-[calc(100vh_-_88px_-_32px)]">
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
          <SignInForm searchParams={searchParams} />
        </div>
      </BaseLayout>
    </>
  );
}
