import { useState } from 'react';
import { Button, useMantineTheme } from '@mantine/core';

import { trpc } from 'utils/trpc';
import useChangeHistory from './useChangeHistory';

interface Props {
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const theme = useMantineTheme();
  const { enabled } = props;
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const { shouldSave, history } = useChangeHistory(enabled);

  const { mutate, isLoading } = trpc.widgets.updateWidget.useMutation({
    onSuccess: () => {
      setLastSaved(history.length - 1);
    }
  });

  const handleSave = () => {
    if (lastSaved === history.length - 1) return;

    const { id, template, ...rest } = history.at(-1)!;
    const changes = {
      ...rest,
      id: id!,
      template: template!,
    };
    mutate(changes);
  }

  if (!shouldSave) return null;

  const variant = theme.colorScheme === 'dark' ? 'white' : 'filled';

  return (
    <Button color="dark" variant={variant} loading={isLoading} onClick={handleSave}>
      Save
    </Button>
  );
}
