import type { NextPage } from 'next';
import Head from 'next/head';

import BaseLayout from 'components/BaseLayout';
import GuestsTable from 'components/GuestsTable';

const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dealo | Guest Users</title>
      </Head>
      <BaseLayout showBackButton backRoute="/dashboard" title="Guest Users">
        <div className="flex flex-col mx-auto max-w-[980px] w-full">
          <GuestsTable />
        </div>
      </BaseLayout>
    </>
  );
};

export default UsersPage;
