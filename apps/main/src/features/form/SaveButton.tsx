'use client'

import { useState } from 'react';

import { trpc } from 'utils/trpc';
import { Button } from 'components/ui/button';
import { useToast } from 'components/ui/use-toast';
import useChangeHistory from './useChangeHistory';

interface Props {
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const { enabled } = props;
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const { shouldSave, history } = useChangeHistory(enabled);

  const { toast } = useToast();

  const { mutate, isLoading } = trpc.widgets.updateWidget.useMutation({
    onSuccess: () => {
      setLastSaved(history.at(-1)!.hash);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'There was an error while saving your changes, please check your network connection before making any more changes.',
      });
    }
  });

  const handleSave = () => {
    if (lastSaved === history.at(-1)?.hash) return;

    const { id, template, ...rest } = history.at(-1)!.changes;
    const changes = {
      ...rest,
      id: id!,
      template: template!,
    };
    mutate(changes);
  }

  const disabled = isLoading || !shouldSave || lastSaved === history.at(-1)?.hash;

  return (
    <Button variant="black" disabled={disabled} onClick={handleSave}>
      Save
    </Button>
  );
}
