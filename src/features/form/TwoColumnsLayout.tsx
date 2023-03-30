import type { ReactNode } from 'react';
import { Divider, Stack } from '@mantine/core';

import RenderIf from 'components/RenderIf';

interface Props {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export default function TwoColumnsLayout(props: Props) {
  const { rightContent, leftContent } = props;

  return (
    <>
      <RenderIf condition={!!leftContent}>
        <Stack pt="xl" style={{ minWidth: '380px', maxWidth: '380px' }}>
          {leftContent}
        </Stack>
        <Divider orientation="vertical" />
      </RenderIf>
      <Stack style={{ flex: 1 }}>
        {rightContent}
      </Stack>
    </>
  );
}
