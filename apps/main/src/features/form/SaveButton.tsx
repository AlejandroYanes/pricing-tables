import { Button, useMantineTheme } from '@mantine/core';

import { trpc } from 'utils/trpc';
import useChangeHistory from './useChangeHistory';

interface Props {
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const theme = useMantineTheme();
  const { enabled } = props;
  const { shouldSave, history } = useChangeHistory(enabled);

  console.log('history', history);

  const { mutate, isLoading } = trpc.widgets.updateWidget.useMutation();

  const handleSave = () => {
    const { id, template, ...rest } = history.at(-1)!;
    const changes = {
      ...rest,
      id: id!,
      template: template!,
    }
    console.log('changes to save', );
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
