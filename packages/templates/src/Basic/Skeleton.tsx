import type { SkeletonProps } from '../constants/types';
import { SKELETON_BLOCK_COLOURS, SKELETON_BORDER_COLOURS } from '../constants/colors';

export function BasicSkeleton(props: SkeletonProps) {
  const { items = 3, scale = 1, color = 'emerald' } = props;
  const arr = Array(items).fill(0);
  return (
    <div className="flex items-center">
      <div className="grid grid-cols-3 justify-items-center box-border gap-4">
        {arr.map((_, index) => (
          <div
            key={index}
            className={`flex flex-col gap-3 rounded-md border-2 ${SKELETON_BORDER_COLOURS[color]}`}
            style={{
              height: 380 * scale,
              width: 300 * scale,
              padding: 16 * scale,
              paddingBottom: 20 * scale,
            }}
          >
            <div className={`w-full h-full rounded-sm flex-1 ${SKELETON_BLOCK_COLOURS[color]}`} />
            <div className="flex flex-col w-full gap-1">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full shrink-0 ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 20 * scale, width: 20 * scale }}
                />
                <div
                  className={`rounded-sm w-full ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 18 * scale }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full shrink-0 ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 20 * scale, width: 20 * scale }}
                />
                <div
                  className={`rounded-sm w-full ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 18 * scale }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full shrink-0 ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 20 * scale, width: 20 * scale }}
                />
                <div
                  className={`rounded-sm w-full ${SKELETON_BLOCK_COLOURS[color]}`}
                  style={{ height: 18 * scale }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
