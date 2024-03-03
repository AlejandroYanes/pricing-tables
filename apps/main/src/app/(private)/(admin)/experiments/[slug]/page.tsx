'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Label,
  Loader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from '@dealo/ui';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/base-layout';
import Distributions from './distributions';

interface Props {
  params: {
    slug: string;
  };
}

export default function ExperimentDetailsPage(props: Props) {
  const { params } = props;
  const  [dateFilter, setDateFilter] = useState<string>('24h');
  const { toast } = useToast();

  const { data: experiment, isLoading } = trpc.experiments.getExperiment.useQuery(params.slug);
  const { data: results = [] } = trpc.experiments.getRecords.useQuery(dateFilter as any, { keepPreviousData: true });

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
        description: 'The Vercel Edge store could not be updated.',
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
            <Label htmlFor="airplane-mode">Running</Label>
            <Switch id="airplane-mode" checked={experiment.running} onCheckedChange={handleRunningStatusChange} />
          </div>
          <div className="flex flex-row gap-4">
            <Distributions slug={params.slug} experiment={experiment}/>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '100px' }}>Variant</TableHead>
              <TableHead style={{ width: '100px' }}>Distribution</TableHead>
              <TableHead style={{ width: '100px' }}>Views</TableHead>
              <TableHead style={{ width: '100px' }}>Visitors</TableHead>
              <TableHead style={{ width: '130px' }}>Signups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiment.variants.map((variant) => {
              const entry = results.find((result) => result.variant === variant);
              return (
                <TableRow key={variant}>
                  <TableCell>
                    <span className="text-lg">{variant}</span>
                  </TableCell>

                  <TableCell>
                    {experiment.distribution[variant]! * 100}%
                  </TableCell>

                  <TableCell>
                    {entry?.views ?? 0}
                  </TableCell>

                  <TableCell>
                    {entry?.visitors ?? 0}
                  </TableCell>

                  <TableCell>
                    {entry?.signups ?? 0}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </section>
    </BaseLayout>
  );
}
