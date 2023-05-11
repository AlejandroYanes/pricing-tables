import { createId } from '@paralleldrive/cuid2';
import type { FormCallback } from 'models';

import { useWidgetFormStore } from '../widget-state';

export function addNewCallback() {
  const { callbacks } = useWidgetFormStore.getState();
  const newId = `cb_${createId()}`;
  const alreadyExists = callbacks.some((cb) => cb.env === '' );
  const lastOrder = callbacks.at(-1)?.order ?? 0;
  const newCallback: FormCallback = {
    id: newId,
    env: '',
    url: '',
    order: lastOrder + 1,
    error: alreadyExists ? 'There can only be one callback per mode' : undefined,
  }
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    callbacks: prev.callbacks.concat(newCallback),
  }));
}
