import { useEffect, useRef, useState } from 'react';
import type { WidgetFormState } from '@dealo/models';

import { useDebounce } from 'utils/hooks/use-debounce';
import { useWidgetFormStore } from '../state';

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const INITIAL_COUNT_BEFORE_SAVE = process.env.NODE_ENV === 'production' ? 1 : 2;

export default function useChangeHistory(enabled = false) {
  const widgetStates = useWidgetFormStore((state) => state);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTick] = useState(Date.now());
  const initialState = useRef<WidgetFormState | undefined>(undefined);
  const history = useRef<{ hash: number; changes: WidgetFormState }[]>([]);
  const shouldSave = useRef(false);

  const { debounceCall } = useDebounce(250);

  useEffect(() => {
    if (enabled) {
      if (history.current.length < INITIAL_COUNT_BEFORE_SAVE) {
        initialState.current = deepClone(widgetStates);
        history.current.push({ hash: Date.now(), changes: deepClone(widgetStates) });
      } else {
        debounceCall(() => {
          history.current.push({ hash: Date.now(), changes: deepClone(widgetStates) });
          if (history.current.length > 10) {
            history.current.shift();
          }
          shouldSave.current = true;
          setTick(Date.now());
        });
      }
    }
  }, [enabled, widgetStates]);

  return { shouldSave: shouldSave.current, history: history.current };
}
