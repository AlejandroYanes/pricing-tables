import { useWidgetFormStore } from '../widget-state';

export function addNewCallback() {
  const { callbacks } = useWidgetFormStore.getState();
  const newId = `${Date.now()}`;
  const alreadyExists = callbacks.some((cb) => cb.env === '' );
  const newCallback = {
    id: newId,
    env: '',
    url: '',
    error: alreadyExists ? 'There can only be one callback per mode' : undefined,
  }
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    callbacks: prev.callbacks.concat(newCallback),
  }));
}
