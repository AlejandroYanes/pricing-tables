'use client';
import { notFound } from 'next/navigation';
import { Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@dealo/ui';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/base-layout';
import Distributions from './Distributions';

interface Props {
  params: {
    slug: string;
  };
}

export default function ExperimentDetailsPage(props: Props) {
  const { params } = props;

  const { data: experiment, isLoading } = trpc.experiments.getExperiment.useQuery(params.slug);

  if (isLoading) {
    return (
      <BaseLayout showBackButton>
        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
          <Loader size="md" />
          <p>Loading experiment...</p>
        </div>
      </BaseLayout>
    );
  }

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
