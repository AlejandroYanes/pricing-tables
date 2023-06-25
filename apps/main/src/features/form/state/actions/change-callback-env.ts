import { applyWhere } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function changeCallbackEnv(index: number, nextEnv: string) {
  const { callbacks } = useWidgetFormStore.getState();
  const callback = callbacks[index];

  if (!callback) return;

  const alreadyExists = callbacks.some((cb) => cb.env === nextEnv );
  useWidgetFormStore.setState({
    callbacks: applyWhere(
      callbacks,
      (_, cbIndex) => cbIndex === index,
      (cb) => ({
        ...cb,
        env: nextEnv,
        error: alreadyExists ? 'There can only be one callback per mode' : undefined,
      })),
  });
}
