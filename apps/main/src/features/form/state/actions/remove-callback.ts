import { remove } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function deleteCallback(index: number) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    callbacks: remove(prev.callbacks, index),
  }));
}
