import Head from 'next/head';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';

const ReturnPage = () => {
  return (
    <>
      <Head>
        <title>Dealo | Stripe connect results</title>
      </Head>
      <BaseLayout showBackButton>
        <div>Stripe connect results</div>
      </BaseLayout>
    </>
  );
};

export default authGuard(ReturnPage);
