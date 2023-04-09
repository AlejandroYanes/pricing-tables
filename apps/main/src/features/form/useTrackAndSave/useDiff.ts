import { useEffect, useRef } from 'react';

import { checkDiff } from './check-diff';
import type { TrackedValue } from './types';

interface Params {
  value: TrackedValue;
  idField?: string;
  keysToTrack?: string[];
  onChange: (diff: TrackedValue) => void;
}

export default function useDiff(params: Params) {
  const { value, idField, keysToTrack, onChange } = params;
  const trackedValue = useRef<TrackedValue>(value);
  const diff = useRef<TrackedValue>(Array.isArray(value) ? [] : {});
  const isDiff = useRef(false);

  useEffect(() => {
    const response = checkDiff(trackedValue.current, value, idField, keysToTrack);
    trackedValue.current = JSON.parse(JSON.stringify(value));
    isDiff.current = response.isDiff;
    diff.current = response.diff;

    if (response.isDiff) {
      onChange(response.diff);
    }
  }, [value]);

  return { isDiff: isDiff.current, diff: diff.current };
}
