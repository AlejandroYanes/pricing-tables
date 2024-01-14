import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Button, RenderIf } from '@dealo/ui';

import BaseLayout from 'components/BaseLayout';

interface Props {
  searchParams: Record<string, string | string[]>;
}

export default function CheckoutError(props: Props) {
  const { searchParams: query } = props;

  const isInternalFlow = query.internal_flow === 'true';
  return (
    <>
      <Head>
        <title>Dealo | Stripe Checkout error</title>
      </Head>
      <BaseLayout hideNavbar hideFooter>
        <div className="flex flex-col items-center justify-center gap-10 h-[100vh]">
          <Image src="/illustrations/undraw_warning.svg" width={320} height={280} alt="successful payment" />
          <h3 className="text text-2xl ml-12 w-[480px]">
            Something went wrong, please contact support at {' '}
            <a href="mailto:support@dealo.app" className="text-emerald-500 hover:underline">support@dealo.app</a>
            .
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
