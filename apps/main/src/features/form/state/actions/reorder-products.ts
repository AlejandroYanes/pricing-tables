import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function reorderProducts({ destination, source }: DropResult) {
  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: reorder(prev.products, { from: source.index, to: destination?.index || 0 }),
  }));
}
