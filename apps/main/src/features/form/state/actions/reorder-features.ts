import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function reorderFeatures({ destination, source }: DropResult) {
  const { features } = useWidgetFormStore.getState();
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    features: reorder(features, { from: source.index, to: destination?.index || 0 }),
  }))
}
