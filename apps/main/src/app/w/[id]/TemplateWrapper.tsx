'use client';

import { mockTemplate, templatesMap } from '@dealo/templates';
import type { WidgetInfo } from '@dealo/models';
import { useEffect, useRef } from 'react';

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
  const environment = env || 'production';

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const parentWindow = window.top;
    if (!wrapper || !parentWindow) return;
    const { width, height } = wrapper.getBoundingClientRect();
    console.log('size to send', width, height);
    console.log('top window width', parentWindow.innerWidth);
    parentWindow.postMessage({ source: 'pricing-widget__size', width, height }, '*');
  }, []);

  return (
    <div
      id="pricing-widget__wrapper"
      className="flex items-center justify-center data-[mobile=true]:w-full data-[mobile=true]:px-4"
    >
      <div id="pricing-widget__content" className="data-[mobile=true]:w-full px-2" ref={wrapperRef}>
        <Template
          widget={id}
          features={features}
          products={products}
          recommended={recommended}
          color={color}
          currency={currency}
          unitLabel={unitLabel}
          subscribeLabel={subscribeLabel}
          freeTrialLabel={freeTrialLabel}
          callbacks={callbacks}
          environment={environment}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
