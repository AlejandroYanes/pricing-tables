import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Button, Group, Stack } from '@mantine/core';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';
import GuestsTable from 'components/GuestsTable';

const UsersPage: NextPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const {
    data: { results, count } = { results: [], count: 0 },
    refetch,
  } = trpc.widgets.listGuestWidgets.useQuery({ page, pageSize }, { keepPreviousData: true });

  const { mutate, isLoading } = trpc.widgets.deleteGuestWidgets.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <>
      <Head>
        <title>Dealo | Guest Users</title>
      </Head>
      <BaseLayout showBackButton backRoute="/dashboard" title="Guest Users">
        <Stack mx="auto" sx={{ maxWidth: '980px', width: '100%' }}>
          <Group position="right" mb="xl">
            <Button color="red" variant="outline" loading={isLoading} onClick={() => mutate()}>Delete All</Button>
          </Group>
          <GuestsTable
            page={page}
            pageSize={pageSize}
            count={count}
            data={results}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Stack>
      </BaseLayout>
    </>
  );
};

export default authGuard(UsersPage);
