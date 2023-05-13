import { callAPI } from 'helpers';
import type { WidgetInfo } from 'models';

import { useWidgetFormStore } from '../widget-state';

export async function fetchWidget(widgetId: string) {
  const widget = await callAPI<WidgetInfo>({ method: 'GET', url: `/api/widgets/${widgetId}/info` });
  useWidgetFormStore.setState({ ...widget, usesUnitLabel: !!widget.unitLabel });
}
