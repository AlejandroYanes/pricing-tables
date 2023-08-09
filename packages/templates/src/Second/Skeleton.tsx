import { createStyles, Group, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 3;
const arr = new Array(items).fill(0);

const useStyles = createStyles((theme, { color }: { color: string }) => ({
  stack: {
    justifyItems: 'center',
    boxSizing: 'border-box',
    '& div:after': {
      backgroundColor: theme.colors[color]![7],
    }
  },
}));

export function SecondSkeleton(props: SkeletonProps) {
  const { scale = 1, color = 'teal' } = props;
  const { classes } = useStyles({ color });
  return (
    <Group spacing={12}>
      {arr.map((_, index) => (
        <Stack key={index} spacing={8} align="center" className={classes.stack}>
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
