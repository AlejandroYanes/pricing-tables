import { Button, useMantineTheme } from '@mantine/core';

import useChangeHistory from './useChangeHistory';

interface Props {
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const theme = useMantineTheme();
  const { shouldSave, history } = useChangeHistory(props.enabled);

  console.log('SaveButton', { shouldSave, history });

  if (!shouldSave) return null;

  return (
    <Button color="dark" variant={theme.colorScheme === 'dark' ? 'white' : 'filled'}>
      Save
    </Button>
  );
}
