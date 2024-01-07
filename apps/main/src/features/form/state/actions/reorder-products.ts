import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function reorderProducts({ destination, source }: DropResult) {
  const prevProducts = useWidgetFormStore.getState().products;
  let nextProducts = reorder(prevProducts, { from: source.index, to: destination?.index || 0 });
  nextProducts = nextProducts.map((prod, index) => ({ ...prod, order: index }));

  useWidgetFormStore.setState({ products: nextProducts });
}
