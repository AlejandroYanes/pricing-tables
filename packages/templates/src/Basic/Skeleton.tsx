import { Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 3;
const arr = new Array(items).fill(0);

export function BasicSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <Stack align="center">
      <SimpleGrid cols={items} spacing="sm" style={{ justifyItems: 'center', boxSizing: 'border-box' }}>
        {arr.map((_, index) => (
          <Skeleton key={index} animate={false} height={300 * scale} width={300 * scale} />
        ))}
        {arr.fill(0).map((_, index) => (
          <Stack key={index} pl={32 * scale} style={{ width: '100%' }}>
            <Group spacing="xs">
              <Skeleton circle animate={false} height={20 * scale} width={20 * scale} />
              <Skeleton animate={false} height={20 * scale} width={170 * scale} />
            </Group>
            <Group spacing="xs">
              <Skeleton circle animate={false} height={20 * scale} width={20 * scale} />
              <Skeleton animate={false} height={20 * scale} width={170 * scale} />
            </Group>
            <Group spacing="xs">
              <Skeleton circle animate={false} height={20 * scale} width={20 * scale} />
              <Skeleton animate={false} height={20 * scale} width={170 * scale} />
            </Group>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
