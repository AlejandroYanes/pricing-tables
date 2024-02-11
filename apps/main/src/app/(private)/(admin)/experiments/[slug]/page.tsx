import * as edgeConfig from '@vercel/edge-config';
import type { Experiment } from '@dealo/models';

import BaseLayout from 'components/base-layout';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ExperimentDetailsPage(props: Props) {
  const { params } = props;
  const storeItem = await edgeConfig.get(params.slug);
  const experiment = storeItem as unknown as Experiment;

  return (
    <BaseLayout title={experiment.title} showBackButton>
      <section className="max-w-[700px] mx-auto p-4 flex flex-col dark:bg-slate-800">

      </section>
    </BaseLayout>
  );
}
