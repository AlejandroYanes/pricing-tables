'use client';

import { mockTemplate, templatesMap } from '@dealo/templates';
import type { WidgetInfo } from '@dealo/models';

import { type ReducedWidgetInfo } from './get-widget-info';

interface Props {
  id: string;
  widget: ReducedWidgetInfo;
  config: {
    theme?: string;
    env?: string;
    currency?: string;
    width?: string;
  };
}

export function TemplateWrapper(props: Props) {
  const { id, widget, config: { currency, env, width } } = props;
  const { render: Template, calculateIsMobile } = widget.template ? templatesMap[widget.template]! : mockTemplate;
  const { products, features, recommended, color, unitLabel, subscribeLabel, freeTrialLabel, callbacks } = widget;
  const isMobile = calculateIsMobile(widget as WidgetInfo, width ? Number(width) : Number.MAX_VALUE);
  const environment = env && env !== 'undefined' ? env : 'production';
  const parsedCurrency = currency && currency !== 'undefined' ? currency : undefined;

  return (
    <Template
      widget={id}
      features={features}
      products={products}
      recommended={recommended}
      color={color}
      currency={parsedCurrency}
      unitLabel={unitLabel}
      subscribeLabel={subscribeLabel}
      freeTrialLabel={freeTrialLabel}
      callbacks={callbacks}
      environment={environment}
      isMobile={isMobile}
    />
  );
}
