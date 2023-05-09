import { useEffect, useRef, useState } from 'react';
import { crush, construct } from 'radash';

import { useDebounce } from 'utils/hooks/useDebounce';
import type { WidgetFormState } from '../state';
import { useWidgetFormStore } from '../state';

const internalDiff = (prevStates: WidgetFormState, nextState: WidgetFormState) => {
  const flatPrevState = crush(prevStates);
  const flatNextState = crush(nextState);
  const flatDifference = Object.keys(flatNextState).reduce((acc, key) => {
    if ((flatNextState as any)[key] !== (flatPrevState as any)[key]) {
      acc[key] = (flatNextState as any)[key];
    }
    return acc;
  }, {} as any);
  const difference = construct(flatDifference);

  return { isDiff: Object.keys(difference).length > 0, diff: difference };
};

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

export default function useChangeHistory(enabled = false) {
  const widgetStates = useWidgetFormStore((state) => state);
  const [_, setTick] = useState(Date.now());
  const initialState = useRef<WidgetFormState | undefined>(undefined);
  const history = useRef<WidgetFormState[]>([]);
  const shouldSave = useRef(false);

  const { debounceCall } = useDebounce(250);

  useEffect(() => {
    if (enabled) {
      if (history.current.length === 0) {
        initialState.current = widgetStates;
        history.current.push(deepClone(widgetStates));
      } else {
        debounceCall(() => {
          const lastHistory = history.current[history.current.length - 1]!;
          const { isDiff: isDifferentToPrev } = internalDiff(lastHistory, widgetStates);
          const { isDiff: isDifferentToInitial } = internalDiff(initialState.current!, widgetStates);

          if (!isDifferentToInitial) {
            setTick(Date.now());
            shouldSave.current = false;
          } else if (isDifferentToPrev) {
            setTick(Date.now());
            history.current.push(deepClone(widgetStates));
            shouldSave.current = true;
          }
        });
      }
    }
  }, [enabled, widgetStates]);

  return { shouldSave: shouldSave.current, history: history.current };
}
