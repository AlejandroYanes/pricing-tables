import { useState } from 'react';
import { Anchor, Button, Stack, Text, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconAlertTriangle } from '@tabler/icons';

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
      setLastSaved(history.at(-1)!.hash);
    },
    onError: () => {
      handleAPIError();
    },
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

  const handleAPIError = () => {
    modals.open({
      centered: true,
      withCloseButton: false,
      children:(
        <Stack>
          <IconAlertTriangle color="orange" size={60} style={{ margin: '0 auto' }} />
          <Text>
            There was an error while saving your changes, please do not make any more.
            First, try to refresh the page and check your network connection.
            If the problem still persist, <Anchor color="orange" href="mailto: alejandro@dealo.com">contact us</Anchor>.
          </Text>
        </Stack>
      ),
    });
  };

  if (!shouldSave) return null;

  const variant = theme.colorScheme === 'dark' ? 'white' : 'filled';
  const disabled = lastSaved === history.at(-1)?.hash;

  return (
    <Button color="dark" variant={variant} loading={isLoading} disabled={disabled} onClick={handleSave}>
      Save
    </Button>
  );
}
