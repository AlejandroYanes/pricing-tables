import { useWidgetFormStore } from '../widget-state';

export function changeFeatureName(featureIndex: number, nextLabel: string) {
  const { features } = useWidgetFormStore.getState();
  const feature = features[featureIndex];

  if (!feature) return;

  feature.name = nextLabel;
  useWidgetFormStore.setState({ features });
}
