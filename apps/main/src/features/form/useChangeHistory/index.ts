import { useEffect, useRef, useState } from 'react';

import { useWidgetFormStore } from '../state';
// import { checkDiff } from './check-diff';

export default function useChangeHistory(enabled = false) {
  const [shouldSave, setShouldSave] = useState(false);
  const history = useRef<any[]>([]);

  useEffect(() => {
    if (enabled) {
      console.log('subscribe to state changes');
      const unsubscribe = useWidgetFormStore.subscribe((state, prevState) => {
        console.log('state has changed', {
          state,
          prevState,
          // diff: { isDiff, diff },
        });
        setShouldSave(true);
        history.current.push(state);
        // const { isDiff, diff } = checkDiff({
        //   trackedValue: prevState,
        //   newValue: state,
        // });
        //
        // console.log('state has changed', {
        //   state,
        //   prevState,
        //   diff: { isDiff, diff },
        // });
        //
        // if (isDiff) {
        //   setShouldSave(true);
        //   history.current.push(state);
        // }
      });
      return () => unsubscribe();
    }
  }, [enabled]);

  return { shouldSave: history.current.length > 1, history: history.current };
}
