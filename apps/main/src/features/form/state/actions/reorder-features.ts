import type { DropResult } from 'react-beautiful-dnd';
import { reorder } from '@dealo/helpers';

import { useWidgetFormStore } from '../widget-state';

export function reorderFeatures({ destination, source }: DropResult) {
  const { features: prevFeatures } = useWidgetFormStore.getState();
  let nexFeatures = reorder(prevFeatures, { from: source.index, to: destination?.index || 0 });

  nexFeatures = nexFeatures.map((feat, index) => ({ ...feat, order: index }));

  useWidgetFormStore.setState({ features: nexFeatures });
}
