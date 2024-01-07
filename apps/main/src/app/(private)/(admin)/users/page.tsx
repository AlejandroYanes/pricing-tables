import type { NextPage } from 'next';
import Head from 'next/head';

import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';

const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dealo | Users</title>
      </Head>
      <BaseLayout hideFooter showBackButton backRoute="/dashboard" title="Users">
        <div className="flex flex-col mx-auto w-full max-w-[980px]">
          <UsersTable />
        </div>
      </BaseLayout>
    </>
  );
};

export default UsersPage;
