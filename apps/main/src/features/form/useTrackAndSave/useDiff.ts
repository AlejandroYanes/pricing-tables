import { useEffect, useRef } from 'react';

import { checkDiff } from './check-diff';
import type { TrackedValue } from './types';

export default function useDiff(value: TrackedValue, idField?: string, keysToTrack?: string[]) {
  const trackedValue = useRef<TrackedValue>(value);
  const diff = useRef<TrackedValue>(Array.isArray(value) ? [] : {});
  const isDiff = useRef(false);

  useEffect(() => {
    const response = checkDiff(trackedValue.current, value, idField, keysToTrack);
    trackedValue.current = JSON.parse(JSON.stringify(value));
    isDiff.current = response.isDiff;
    diff.current = response.diff;
  }, [value]);

  return { isDiff: isDiff.current, diff: diff.current };
}
