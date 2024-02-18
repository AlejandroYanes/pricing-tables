'use client'
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button, Loader, RenderIf } from '@dealo/ui';

import BaseLayout from 'components/base-layout';
import { recordSignup } from './action';

interface Props {
  searchParams: Record<string, string | null>;
}

export default function FirstTimePage(props: Props) {
  const { searchParams } = props;
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && searchParams.signup === 'true') {
      recordSignup();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Dealo | First time setup</title>
        </Head>
        <BaseLayout>
          <div className="w-full max-w-[700px] h-[calc(100vh-64px)] mx-auto flex flex-col items-center justify-center">
            <Loader />
          </div>
        </BaseLayout>
      </>
    );
  }

  if (!data?.user) {
    router.push('/');
    return null;
  }

  const { hasLegacySetup } = data.user;

  return (
    <>
      <Head>
        <title>Dealo | First time setup</title>
      </Head>
      <BaseLayout>
        <div className="w-full max-w-[900px] h-[calc(100vh-64px)] mx-auto mt-10 flex flex-col">
          <div className="w-full flex flex-row items-center gap-10">
            <div className="flex flex-col gap-10">
              <h1 className="text-5xl font-bold">Welcome!</h1>
              <RenderIf condition={hasLegacySetup}>
                <span className="text-base">
                We are updating the way we connect to your Stripe account. <br/>
                We are moving to a more secure way, which basically means that we will no longer require knowing your Stripe key.
                For this to work we need you to complete a few steps, this time within Stripe.
                  <br/>
                After you complete the steps, we will remove your Stripe key from our database.
                </span>
              </RenderIf>
              <RenderIf condition={!hasLegacySetup}>
                <span className="text-base">
                Welcome, as a final step we need you to connect your Stripe account to our platform.
                We will redirect you to Stripe, where you will be asked to complete a series of steps.
                After that you will be free to use our app.
                </span>
              </RenderIf>
              <Link href="/api/stripe/connect/start" className="ml-auto">
                <Button>Proceed</Button>
              </Link>
            </div>
            <Image
              width={380}
              height={400}
              alt="welcoming illustration"
              src="/illustrations/undraw_welcoming.svg"
              className="w-[380px] h-[400px]"
              priority
            />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}
