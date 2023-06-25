import type { SkeletonProps } from '../constants/types';

const items = 3;
const arr = new Array(items).fill(0);

export function SecondSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <div className="flex flex-row gap-3">
      {arr.map((_, index) => (
        <div className="flex flex-col items-center gap-2" key={index}>
          <div className="rounded-sm bg-neutral-200" style={{ height: 80 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200 mb-2" style={{ height: 100 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200" style={{ height: 40 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200" style={{ height: 40 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200" style={{ height: 40 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200 mb-2" style={{ height: 40 * scale, width: 300 * scale }} />
          <div className="rounded-sm bg-neutral-200" style={{ height: 40 * scale, width: 300 * scale }} />
        </div>
      ))}
    </div>
  );
}
