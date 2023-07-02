import type { SkeletonProps } from '../constants/types';

const items = 4;
const arr = new Array(items).fill(0);

export function ThirdSkeleton(props: SkeletonProps) {
  const { scale = 1 } = props;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-2">
        {arr.map((_, index) => (
          <div key={index} className="rounded-sm bg-emerald-500" style={{ height: 80 * scale, width: 300 * scale }}  />
        ))}
      </div>
      <div className="rounded-sm bg-emerald-500" style={{ height: 600 * scale, width: 380 * scale }} />
    </div>
  );
}
