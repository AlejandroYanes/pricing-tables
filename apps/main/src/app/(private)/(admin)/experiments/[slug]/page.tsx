import { notFound } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@dealo/ui';
import type { Experiment } from '@dealo/models';

import { getStoreItem } from 'utils/vercel-edge-config';
import BaseLayout from 'components/base-layout';
import Distributions from './Distributions';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ExperimentDetailsPage(props: Props) {
  const { params } = props;
  const experiment = await getStoreItem<Experiment>(params.slug, [`experiment/slug/${params.slug}`]);

  if (!experiment) {
    return notFound();
  }

  return (
    <BaseLayout title={experiment.title} showBackButton>
      <section className="w-full max-w-[900px] mx-auto flex flex-col items-stretch">
        <div className="flex flex-row justify-end mb-8">
          <Distributions slug={params.slug} experiment={experiment} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '100px' }}>Variant</TableHead>
              <TableHead style={{ width: '100px' }}>Distribution</TableHead>
              <TableHead style={{ width: '100px' }}>Visits</TableHead>
              <TableHead style={{ width: '130px' }}>Signups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiment.variants.map((variant) => (
              <TableRow key={variant}>
                <TableCell>
                  <span className="text-lg">{variant}</span>
                </TableCell>

                <TableCell>
                  {experiment.distribution[variant]! * 100}%
                </TableCell>

                <TableCell>
                  {experiment.results[variant]!.visits}
                </TableCell>

                <TableCell>
                  {experiment.results[variant]!.signups}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </BaseLayout>
  );
}
