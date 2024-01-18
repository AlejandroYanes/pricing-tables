import type { SkeletonProps } from '../constants/types';
import { SKELETON_COLOURS } from '../constants/colors';

export function ThirdSkeleton(props: SkeletonProps) {
  const { items = 4, scale = 1, color = 'emerald' } = props;
  const arr = new Array(items).fill(0);
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-2">
        {arr.map((_, index) => (
          <div
            key={index}
            className={`rounded-sm ${SKELETON_COLOURS[color]}`}
            style={{ height: 80 * scale, width: 300 * scale }}
          />
        ))}
      </div>
      <div
        className={`rounded-sm ${SKELETON_COLOURS[color]}`}
        style={{ height: 600 * scale, width: 380 * scale }}
      />
    </div>
  );
}
