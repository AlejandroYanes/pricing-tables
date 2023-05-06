import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Stack } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import type { Role } from 'models';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import UsersTable from 'components/UsersTable';

const UsersPage: NextPage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useDebouncedState('', 200);
  const [page, setPage] = useState(1);

  const {
    data: { results, count } = { results: [], count: 0 },
    refetch,
  } = trpc.user.listUsers.useQuery({ query, page }, { keepPreviousData: true });

  const { mutate } = trpc.user.updateRole.useMutation({
    onSuccess: () => refetch(),
  });

  const changeUserRole = (userId: string, newRole: Role) => {
    mutate({ userId, newRole: newRole as string });
  };

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
            currentUser={session?.user?.id}
            updateRole={changeUserRole}
            onPageChange={setPage}
            onQueryChange={setQuery}
          />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default authGuard(UsersPage);
