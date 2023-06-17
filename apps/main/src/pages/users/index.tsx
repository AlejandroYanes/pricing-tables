import type { NextPage } from 'next';
import Head from 'next/head';
import { Stack } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';

const UsersPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dealo | Users</title>
      </Head>
      <BaseLayout showBackButton backRoute="/dashboard" title="Users">
        <Stack mx="auto" sx={{ maxWidth: '980px', width: '100%' }}>
          <UsersTable />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default authGuard(UsersPage);
