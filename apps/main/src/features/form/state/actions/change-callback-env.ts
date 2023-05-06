import { useWidgetFormStore } from '../widget-state';

export function changeCallbackEnv(index: number, nextEnv: string) {
  const { callbacks } = useWidgetFormStore.getState();
  const callback = callbacks[index];

  if (!callback) return;

  const alreadyExists = callbacks.some((cb) => cb.env === nextEnv );
  if (alreadyExists) {
    callback.error = 'There can only be one callback per mode'
  } else if (callback?.error) {
    callback.error = undefined;
  }

  callback.env = nextEnv;
  useWidgetFormStore.setState({ callbacks });
}
