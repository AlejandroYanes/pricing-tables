import type { DropResult } from 'react-beautiful-dnd';
import { applyWhere, reorder } from 'helpers';

import { useWidgetFormStore } from '../widget-state';

export function reorderProducts({ destination, source }: DropResult) {
  const sourceIndex = source.index;
  const destinationIndex = destination?.index || 0;
  const prevProducts = useWidgetFormStore.getState().products;
  let nextProducts = reorder(prevProducts, { from: sourceIndex, to: destinationIndex });

  nextProducts = applyWhere(
    nextProducts,
    (_, index) => index === sourceIndex || index === destinationIndex,
    (product, index) => {
      if (index === sourceIndex) {
        return { ...product, createdAt: nextProducts[destinationIndex]!.createdAt };
      }
      if (index === destinationIndex) {
        return { ...product, createdAt: nextProducts[sourceIndex]!.createdAt };
      }
      return product;
    },
  );

  useWidgetFormStore.setState((prev) => ({
    ...prev,
    products: nextProducts,
  }));
}
