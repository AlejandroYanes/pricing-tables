import { useWidgetFormStore } from '../widget-state';

export function changeUnitLabel(nextUnit: string) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    unitLabel: nextUnit,
  }));
}
