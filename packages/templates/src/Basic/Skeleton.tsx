import { Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '../constants/types';

const items = 3;
const arr = new Array(items).fill(0);

export function BasicSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-rows-3 justify-items-center box-border gap-4">
        {arr.map((_, index) => (
          <div key={index} className="rounded-sm bg-slate-200" style={{ height: 300 * scale, width: 300 * scale }} />
        ))}
        {arr.fill(0).map((_, index) => (
          <div key={index} className="flex flex-col w-full" style={{ paddingLeft: 32 * scale }}>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-200" style={{ height: 20 * scale, width: 20 * scale }} />
              <div className="rounded-sm bg-slate-200" style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-200" style={{ height: 20 * scale, width: 20 * scale }} />
              <div className="rounded-sm bg-slate-200" style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-200" style={{ height: 20 * scale, width: 20 * scale }} />
              <div className="rounded-sm bg-slate-200" style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
