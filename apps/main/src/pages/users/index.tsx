import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Stack } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';

const UsersPage: NextPage = () => {
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);

  const {
    data: { results, count } = { results: [], count: 0 },
  } = trpc.user.listUsers.useQuery({ query, page }, { keepPreviousData: true });

  return (
    <>
      <Head>
        <title>Dealo | Users</title>
      </Head>
      <BaseLayout showBackButton backRoute="/dashboard" title="Users">
        <Stack mx="auto" sx={{ maxWidth: '980px', width: '100%' }}>
          <UsersTable
            page={page}
            count={count}
            data={results}
            onPageChange={setPage}
            onQueryChange={setQuery}
          />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default authGuard(UsersPage);
