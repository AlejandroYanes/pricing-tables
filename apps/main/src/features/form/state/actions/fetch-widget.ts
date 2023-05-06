import { callAPI } from 'helpers';
import type { FormCallback, FormFeature, FormProduct } from 'models';

import { useWidgetFormStore } from '../widget-state';

type WidgetInfo = {
  id: string;
  name: string;
  template: string;
  color: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  recommended: string | null;
  unitLabel: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
  products: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
}

export async function fetchWidget(widgetId: string) {
  const widget = await callAPI<WidgetInfo>({ method: 'GET', url: `/api/widgets/${widgetId}/info` });
  useWidgetFormStore.setState({ ...widget, selectedProducts: widget.products });
}
