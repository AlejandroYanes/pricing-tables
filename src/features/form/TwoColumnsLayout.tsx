import type { ReactNode } from 'react';
import { Divider, Stack } from '@mantine/core';

interface Props {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export default function TwoColumnsLayout(props: Props) {
  const { rightContent, leftContent } = props;

  return (
    <>
      <Stack pt="xl" style={{ minWidth: '420px', maxWidth: '420px' }}>
        {leftContent}
      </Stack>
      <Divider orientation="vertical" />
      <Stack style={{ flex: 1 }}>
        {rightContent}
      </Stack>
    </>
  );
}
