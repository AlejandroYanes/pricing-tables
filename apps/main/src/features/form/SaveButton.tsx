import { Button, useMantineTheme } from '@mantine/core';

import useChangeHistory from './useChangeHistory';

interface Props {
  enabled?: boolean;
}

export default function SaveButton(props: Props) {
  const theme = useMantineTheme();
  const { shouldSave, changes } = useChangeHistory(props.enabled);

  const handleSave = () => {
    console.log('Saving changes:', changes);
  }

  if (!shouldSave) return null;

  return (
    <Button color="dark" variant={theme.colorScheme === 'dark' ? 'white' : 'filled'} onClick={handleSave}>
      Save
    </Button>
  );
}
