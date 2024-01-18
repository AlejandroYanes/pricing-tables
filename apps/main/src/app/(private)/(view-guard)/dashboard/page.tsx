'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Loader } from '@dealo/ui';
import { skeletonMap } from '@dealo/templates';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/BaseLayout';
import TemplatesModal from 'components/TemplatesModal';
import AddBlock from './AddBlock';

const DashboardPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { data = [], isLoading } = trpc.widgets.list.useQuery();

  const { mutate, isLoading: isMutating } = trpc.widgets.create.useMutation({
    onSuccess: (widgetId: string) => router.push(`/form/${widgetId}`),
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Dealo | Dashboard</title>
        </Head>
        <BaseLayout title="Dashboard">
          <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center">
            <Loader />
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dealo | Dashboard</title>
      </Head>
      <BaseLayout title="Dashboard">
        <div className="flex items-stretch gap-6 flex-wrap">
          {data.map((widget) => {
            const { id, name, template } = widget;
            const Skeleton = skeletonMap[template];

            return (
              <Link href={`/form/${id}`} key={id}>
                <Button
                  variant="ghost"
                  key={id}
                  className="flex flex-col items-center h-[260px] w-[330px] p-4 rounded-sm border-2 border-dashed border-neutral-300"
                >
                  {/* @ts-ignore */}
                  <Skeleton scale={0.3} color="gray" />
                  <span className="text-sm mt-auto">{name}</span>
                </Button>
              </Link>
            )
          })}
          <AddBlock label="Add new" onClick={() => setShowModal(true)} />
          <TemplatesModal
            opened={showModal}
            loading={isMutating}
            onSelect={(values) => mutate(values)}
            onClose={() => setShowModal(false)}
          />
        </div>
      </BaseLayout>
    </>
  );
};

export default DashboardPage;
