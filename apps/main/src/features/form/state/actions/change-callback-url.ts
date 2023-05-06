import { useWidgetFormStore } from '../widget-state';

export function changeCallbackUrl(index: number, nextUrl: string) {
  const { callbacks } = useWidgetFormStore.getState();
  const callback = callbacks[index];

  if (!callback) return;

  callback.url = nextUrl;
  useWidgetFormStore.setState({ callbacks });
}
