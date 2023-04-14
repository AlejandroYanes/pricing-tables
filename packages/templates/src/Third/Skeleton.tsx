import { Group, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 4;
const arr = new Array(items).fill(0);

export function ThirdSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <Group spacing={12} align="flex-start">
      <Stack spacing={8}>
        {arr.map((_, index) => (
          <Skeleton key={index} animate={false} height={80 * scale} width={380 * scale} />
        ))}
      </Stack>
      <Skeleton animate={false} height={600 * scale} width={380 * scale} />
    </Group>
  );
}
