import type { SkeletonProps } from '../constants/types';
import { SKELETON_BLOCK_COLOURS } from '../constants/colors';

export function BasicSkeleton(props: SkeletonProps) {
  const { items = 3, scale = 1, color = 'emerald' } = props;
  const arr = Array(items).fill(0);
  return (
    <div className="flex items-center">
      <div className="grid grid-cols-3 justify-items-center box-border gap-4">
        {arr.map((_, index) => (
          <div key={index} className={`rounded-sm ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 300 * scale, width: 300 * scale }} />
        ))}
        {arr.fill(0).map((_, index) => (
          <div key={index} className="flex flex-col w-full" style={{ paddingLeft: 32 * scale }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`rounded-full ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 20 * scale }} />
              <div className={`rounded-sm ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className={`rounded-full ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 20 * scale }} />
              <div className={`rounded-sm ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`rounded-full ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 20 * scale }} />
              <div className={`rounded-sm ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 20 * scale, width: 170 * scale }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
