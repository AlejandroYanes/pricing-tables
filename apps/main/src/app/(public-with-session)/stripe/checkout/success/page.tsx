import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button, RenderIf } from '@dealo/ui';

import BaseLayout from 'components/BaseLayout';

interface Props {
  searchParams: Record<string, string | string[]>;
}

export default function CheckoutSuccess(props: Props) {
  const { searchParams: query } = props;

  const isInternalFlow = query.internal_flow === 'true';
  const isFreeTrial = query.free_trial === 'true';

  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout success</title>
      </Head>
      <BaseLayout hideNavbar hideFooter>
        <div className="flex flex-col items-center justify-center gap-10 h-[100vh]">
          <Image src="/illustrations/undraw_order_confirmed.svg" width={320} height={280} alt="successful payment"/>
          <h3 className="text text-2xl w-[360px]">
            {isFreeTrial ? 'Your free trial has been activated!' : 'Your payment was successful!'}
          </h3>
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
