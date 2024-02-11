/* eslint-disable max-len */
import Link from 'next/link';
import * as edgeConfig from '@vercel/edge-config';
import type { Experiment } from '@dealo/models';
import { formatDate } from '@dealo/helpers';

import BaseLayout from 'components/base-layout';

export default async function ExperimentsPage() {
  const edgeStore = await edgeConfig.getAll();

  const experiments = Object.keys(edgeStore);
  console.log('experiments', experiments);

  return (
    <BaseLayout title="Experiments">
      <section className="grid grid-cols-2">
        {experiments.map((key) => {
          const experiment = edgeStore[key] as unknown as Experiment;
          return (
            <Link key={key} href={`/experiments/${key}`} className="cursor-pointer">
              <div className="flex flex-col gap-5 p-4 max-w-[380px] rounded border border-neutral-600 hover:border-emerald-500 transition-colors duration-100 ease-linear">
                <h3 className="text-3xl">{experiment.title}</h3>
                <div className="flex justify-between">
                  <p>
                    <span className="text-neutral-300">Created at</span>
                    <br/>
                    <span className="font-bold">{formatDate(experiment.created_at)}</span>
                  </p>
                  <p className="text-center">
                    <span className="text-neutral-300">Variants</span>
                    <br/>
                    <span className="font-bold">{experiment.variants.length}</span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </BaseLayout>
  );
}
