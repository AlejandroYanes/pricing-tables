'use client'

import { useCallback, useRef } from 'react';

export function useDebounce(countDown: number) {
  const timerReference = useRef<any>(undefined);

  const debounceCall = useCallback((callback: () => void) => {
    if (timerReference.current) {
      clearTimeout(timerReference.current);
      timerReference.current = undefined;
    }
    timerReference.current = setTimeout(callback, countDown);
  }, [countDown]);

  return { timer: timerReference.current, debounceCall };
}
