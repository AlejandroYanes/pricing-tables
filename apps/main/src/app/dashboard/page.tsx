'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createStyles, Group, LoadingOverlay, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconNewSection } from '@tabler/icons';
import { skeletonMap } from 'templates';

import { trpc } from 'utils/trpc';
import authGuard from 'utils/hoc/authGuard';
import viewSizeGuard from 'utils/hoc/viewSizeGuard';
import BaseLayout from 'components/BaseLayout';
import TemplatesModal from 'components/TemplatesModal';

const useStyles = createStyles((theme) => ({
  block: {
    height: '260px',
    width: '330px',
    padding: '16px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[5]}`,
    transition: 'all 100ms ease-out',
    ['&:hover']: {
      borderColor: theme.colors.teal[5],
    }
  },
  addBlock: {
    height: '260px',
    width: '330px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    borderRadius: theme.radius.sm,
    border: `1px dashed ${theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[5]}`,
    transition: 'all 100ms ease-out',
    ['&:hover']: {
      borderColor: theme.colors.teal[5],
    }
  },
}));

function AddBlock(props: { label: string; onClick: () => void }) {
  const { label, onClick } = props;
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.addBlock} onClick={onClick}>
      <IconNewSection size={60} />
      <Text size="xl">{label}</Text>
    </UnstyledButton>
  );
}

const DashboardPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { classes } = useStyles();

  const { isLoading, data = [] } = trpc.widgets.list.useQuery();

  const { mutate, isLoading: isMutating } = trpc.widgets.create.useMutation({
    onSuccess: (widgetId: string) => router.push(`/form/${widgetId}`),
  });

  return (
    <>
      <Head>
        <title>Dealo | Dashboard</title>
      </Head>
      <BaseLayout title="Dashboard">
        <Group spacing="xl">
          {data.map((widget) => {
            const { id, name, template } = widget;
            const Skeleton = skeletonMap[template];

            return (
              <Link href={`/form/${id}`} key={id}>
                <Stack key={id} align="center" className={classes.block}>
                  {/* @ts-ignore */}
                  <Skeleton scale={0.3} />
                  <Text mt="auto" size="sm">{name}</Text>
                </Stack>
              </Link>
            )
          })}
          <AddBlock label="Add new" onClick={() => setShowModal(true)} />
        </Group>
        <TemplatesModal
          opened={showModal}
          loading={isMutating}
          onSelect={(values) => mutate(values)}
          onClose={() => setShowModal(false)}
        />
        <LoadingOverlay visible={isLoading} />
      </BaseLayout>
    </>
  );
};

export default viewSizeGuard(authGuard(DashboardPage));
