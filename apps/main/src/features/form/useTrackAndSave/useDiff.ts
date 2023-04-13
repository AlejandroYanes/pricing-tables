import { useEffect, useRef } from 'react';

import { useDebounce } from 'utils/hooks/useDebounce';
import { checkDiff } from './check-diff';
import type { Params, TrackedValue } from './types';

export default function useDiff(params: Params) {
  const { value, idField, keysToTrack, onChange, enabled } = params;
  const trackedValue = useRef<TrackedValue>(value);
  const diff = useRef<TrackedValue>(Array.isArray(value) ? [] : {});
  const isDiff = useRef(false);

  const { debounceCall } = useDebounce(500);

  useEffect(() => {
    const response = checkDiff({ trackedValue: trackedValue.current, newValue: value, idField, keysToTrack });
    trackedValue.current = JSON.parse(JSON.stringify(value));
    isDiff.current = response.isDiff;
    diff.current = response.diff;

    if (enabled && response.isDiff) {
      debounceCall(() => onChange(response.diff));
    }
  }, [value]);

  return { isDiff: isDiff.current, diff: diff.current };
}
