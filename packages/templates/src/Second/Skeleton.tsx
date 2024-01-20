import type { SkeletonProps } from '../constants/types';
import { SKELETON_BLOCK_COLOURS, SKELETON_BORDER_COLOURS } from '../constants/colors';

export function SecondSkeleton(props: SkeletonProps) {
  const { items = 3, scale = 1, color = 'emerald' } = props;
  const arr = new Array(items).fill(0);
  return (
    <div className={`flex flex-row gap-1 rounded border-2 ${SKELETON_BORDER_COLOURS[color]} p-1`}>
      {arr.map((_, index) => (
        <div className="flex flex-col items-center gap-1" key={index}>
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 80 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]} mb-2`} style={{ height: 100 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 40 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 40 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 40 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]} mb-2`} style={{ height: 40 * scale, width: 300 * scale }} />
          <div className={`rounded-smj ${SKELETON_BLOCK_COLOURS[color]}`} style={{ height: 40 * scale, width: 300 * scale }} />
        </div>
      ))}
    </div>
  );
}
