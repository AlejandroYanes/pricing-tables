'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { skeletonMap } from 'templates';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/BaseLayout';
import TemplatesModal from 'components/TemplatesModal';
import AddBlock from './AddBlock';
import { Button } from '../../../components/ui/button';

const DashboardPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { data = [] } = trpc.widgets.list.useQuery();

  const { mutate, isLoading: isMutating } = trpc.widgets.create.useMutation({
    onSuccess: (widgetId: string) => router.push(`/form/${widgetId}`),
  });

  return (
    <>
      <Head>
        <title>Dealo | Dashboard</title>
      </Head>
      <BaseLayout title="Dashboard">
        <div className="flex items-stretch gap-6 flex-wrap">
          {data.map((widget) => {
            const { id, name, template } = widget;
            // const Skeleton = skeletonMap[template];

            return (
              <Link href={`/form/${id}`} key={id}>
                <Button
                  variant="ghost"
                  key={id}
                  className="flex flex-col items-center h-[260px] w-[320px] p-4 rounded-sm border-2 border-dashed border-neutral-300"
                >
                  {/* @ts-ignore */}
                  {/*<Skeleton scale={0.3} />*/}
                  <div className="w-[80px] h-[80px] bg-neutral-400 my-auto rounded-lg" />
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
