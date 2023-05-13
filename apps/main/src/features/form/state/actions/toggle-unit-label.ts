import { useWidgetFormStore } from '../widget-state';

export function toggleUnitLabel() {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    usesUnitLabel: !prev.usesUnitLabel,
    unitLabel: !prev.usesUnitLabel ? 'units' : null,
  }));
}
