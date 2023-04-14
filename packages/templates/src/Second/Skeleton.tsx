import { Group, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 3;
const arr = new Array(items).fill(0);

export function SecondSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <Group spacing={12}>
      {arr.map((_, index) => (
        <Stack key={index} spacing={8} align="center">
          <Skeleton animate={false} height={80 * scale} width={300 * scale} />
          <Skeleton animate={false} height={100 * scale} width={300 * scale} mb="xs" />
          <Skeleton animate={false} height={40 * scale} width={300 * scale} />
          <Skeleton animate={false} height={40 * scale} width={300 * scale} />
          <Skeleton animate={false} height={40 * scale} width={300 * scale} />
          <Skeleton animate={false} height={40 * scale} width={300 * scale} mb="xs" />
          <Skeleton animate={false} height={40 * scale} width={240 * scale} />
        </Stack>
      ))}
    </Group>
  );
}
