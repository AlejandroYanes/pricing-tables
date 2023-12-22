import Head from 'next/head';
import { useSession } from 'next-auth/react';

import BaseLayout from 'components/BaseLayout';

const PricingPage = () => {
  const { data } = useSession();
  const user = data?.user;

  return (
    <>
      <Head>
        <title>Dealo | Pricing</title>
      </Head>
      <BaseLayout showBackButton={!!user} backRoute="/dashboard">
        {/* TODO: show the widget */}
        Pricing page
      </BaseLayout>
    </>
  );
};

export default PricingPage;
