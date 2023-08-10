import { createStyles, Group, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 4;
const arr = new Array(items).fill(0);

const useStyles = createStyles((theme, { color }: { color: string }) => ({
  stack: {
    justifyItems: 'center',
    boxSizing: 'border-box',
    '& div[data-el="skeleton"]:after': {
      backgroundColor: theme.colors[color]![7],
    }
  },
}));

export function ThirdSkeleton(props: SkeletonProps) {
  const { scale = 1, color = 'teal' } = props;
  const { classes } = useStyles({ color });

  return (
    <Group spacing={12} align="flex-start" className={classes.stack}>
      <Stack spacing={8}>
        {arr.map((_, index) => (
          <Skeleton key={index} animate={false} height={80 * scale} width={380 * scale} data-el="skeleton" />
        ))}
      </Stack>
      <Skeleton animate={false} height={600 * scale} width={380 * scale} data-el="skeleton" />
    </Group>
  );
}
