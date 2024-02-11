'use client';
import { notFound } from 'next/navigation';
import { Label, Loader, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useToast } from '@dealo/ui';

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

  const { toast } = useToast();
  const { data: experiment, isLoading } = trpc.experiments.getExperiment.useQuery(params.slug);

  const utils = trpc.useContext();
  const { mutateAsync: updateRunningStatus } = trpc.experiments.updateStatus.useMutation({
    onMutate: (variables) => {
      utils.experiments.getExperiment.setData(params.slug, (prev) => {
        if (!prev) return prev;
        return { ...prev, running: variables.running };
      });
    },
    onError: (_e, variables) => {
      toast({
        variant: 'destructive',
        title: 'Failed to update running status',
        description: 'The Edge store could not be updated.',
      });
      utils.experiments.getExperiment.setData(params.slug, (prev) => {
        if (!prev) return prev;
        return { ...prev, running: !variables.running };
      });
    }
  });

  const handleRunningStatusChange = async (running: boolean) => {
    if (!experiment) return;

    await updateRunningStatus({ slug: params.slug, experiment, running });
    utils.experiments.getExperiment.setData(params.slug, { ...experiment, running });
  }

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
        <div className="flex flex-row items-center justify-between mt-8 mb-16">
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" checked={experiment.running} onCheckedChange={handleRunningStatusChange} />
            <Label htmlFor="airplane-mode">Running</Label>
          </div>
          <Distributions slug={params.slug} experiment={experiment}/>
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
