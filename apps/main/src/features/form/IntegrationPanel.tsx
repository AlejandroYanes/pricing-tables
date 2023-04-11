import { Stack } from '@mantine/core';
import { Prism } from '@mantine/prism';

interface Props {
  widgetId: string;
}

const demoCode = `import { Button } from '@mantine/core';

function Demo() {
  return <Button>Hello</Button>
}`;

export default function IntegrationPanel(props: Props) {
  const { widgetId } = props;
  return (
    <Stack mx="auto" pt="xl" style={{ width: '100%' }}>
      Integration Panel {widgetId}
      <Prism language="tsx" mt="xl">{demoCode}</Prism>
    </Stack>
  );
}
