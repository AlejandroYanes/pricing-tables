'use client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Button, RenderIf } from '@dealo/ui';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  const { query } = useRouter();

  const isInternalFlow = query.internal_flow === 'true';
  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout error</title>
      </Head>
      <BaseLayout hideNavbar>
        <div className="flex flex-col items-center justify-center h-[100vh]">
          <div className="flex flex-row items-center">
            <IconAlertTriangle size={88} />
            <h3 className="text text-2xl w-[480px]">
              Something went wrong, please contact support at {' '}
              <a href="mailto:support@dealo.app">support@dealo.app</a>
              .
            </h3>
          </div>
          <RenderIf condition={isInternalFlow}>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </RenderIf>
        </div>
      </BaseLayout>
    </>
  );
}
