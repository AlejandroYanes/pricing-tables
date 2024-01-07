import { useEffect, useState } from 'react';
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';
import { mockTemplate, templatesMap } from '@dealo/templates';
import { callAPI } from '@dealo/helpers';
import type { WidgetInfo } from '@dealo/models';

import { fixedStyles } from './fixed-styles';

interface Props {
  widget?: string;
  env?: string;
  theme?: string;
  currency?: string;
  internal?: boolean;
}

const PricingCards = (props: Props) => {
  const { widget, currency, env, theme: colorScheme = 'light', internal } = props;
  const [widgetInfo, setWidgetInfo] = useState<WidgetInfo | undefined>(undefined);

  useEffect(() => {
    if (window) {
      const currentUrl = new URL(window.location.href);
      const fetchUrl = internal
        ? `${currentUrl.origin}/api/client/widget/${widget}`
        : `https://www.dealo.app/api/client/widget/${widget}`;

      if (widget) {
        callAPI({
          url: fetchUrl,
          method: 'GET',
        })
          .then((res) => {
            setWidgetInfo(res as any);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [widget]);

  if (!widgetInfo) return null;

  const { render: Template, calculateIsMobile } = widgetInfo.template
    ? templatesMap[widgetInfo.template]!
    : mockTemplate;

  const { products, features, recommended, color, unitLabel, subscribeLabel, freeTrialLabel, callbacks } = widgetInfo;
  const selectedEnv = callbacks.some((cb) => cb.env === env) ? env : undefined;

  return (
    <>
      <style>
        {fixedStyles}
      </style>
      <Template
        widget={widget}
        features={features}
        products={products}
        recommended={recommended}
        color={color}
        currency={currency}
        unitLabel={unitLabel}
        subscribeLabel={subscribeLabel}
        freeTrialLabel={freeTrialLabel}
        callbacks={callbacks}
        environment={selectedEnv}
        isMobile={calculateIsMobile(widgetInfo, window.innerWidth)}
      />
    </>
  );
};

class Wrapper extends HTMLElement {
  domRoot: ReactDOM.Root;

  props: Props = {
    widget: undefined,
    env: undefined,
    theme: undefined,
    currency: undefined,
    internal: false,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.domRoot = ReactDOM.createRoot(this.shadowRoot || this);
    this.props = {
      env: this.getAttribute('env') || undefined,
      widget: this.getAttribute('widget') || undefined,
      theme: this.getAttribute('theme') || undefined,
      currency: this.getAttribute('currency') || undefined,
      internal: !!this.getAttribute('internal'),
    };
  }

  render() {
    this.domRoot.render(<PricingCards {...this.props} />);
  }

  static get observedAttributes() {
    return ['theme', 'currency', 'widget', 'env', 'internal'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) return;
    if (newValue === (this.props as any)[name]) return;

    (this.props as any)[name] = newValue as any;
    this.render();
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('pricing-cards', Wrapper);

export default PricingCards;
