'use client';

import { mockTemplate, templatesMap } from '@dealo/templates';

import { type ReducedWidgetInfo } from './get-widget-info';

interface Props {
  id: string;
  widget: ReducedWidgetInfo;
}

export function TemplateWrapper(props: Props) {
  const { id, widget } = props;
  const { render: Template } = widget.template ? templatesMap[widget.template]! : mockTemplate;
  const { products, features, recommended, color, unitLabel, subscribeLabel, freeTrialLabel, callbacks } = widget;

  return (
    <Template
      widget={id}
      features={features}
      products={products}
      recommended={recommended}
      color={color}
      // currency={currency}
      unitLabel={unitLabel}
      subscribeLabel={subscribeLabel}
      freeTrialLabel={freeTrialLabel}
      callbacks={callbacks}
      // environment={selectedEnv}
    />
  );
}