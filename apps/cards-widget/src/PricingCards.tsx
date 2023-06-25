import { useEffect, useState } from 'react';
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client'
import createCache from '@emotion/cache'
import type { EmotionCache } from '@emotion/react';
import { PricingThemeProvider } from '@dealo/ui';
import { templatesMap } from '@dealo/templates';
import { callAPI } from '@dealo/helpers';
import type { FormCallback, FormFeature, FormProduct } from '@dealo/models';

interface Props {
  cache?: EmotionCache;
  widget?: string;
  env?: string;
  theme?: string;
  currency?: string;
}

type WidgetInfo = {
  id: string;
  template: string;
  recommended: string;
  color: string;
  currency: string;
  unitLabel: string;
  subscribeLabel: string;
  freeTrialLabel: string;
  products: FormProduct[];
  features: FormFeature[];
  callbacks: FormCallback[];
};

const PricingCards = (props: Props) => {
  const { cache, widget, currency, env, theme: colorScheme = 'light' } = props;
  const [widgetInfo, setWidgetInfo] = useState<WidgetInfo | undefined>(undefined);

  useEffect(() => {
    if (widget) {
      callAPI({
        url: `https://dealo.app/api/client/widget/${widget}`,
        method: 'GET',
      })
        .then((res) => {
          setWidgetInfo(res as any);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [widget]);

  if (!widgetInfo) return null;

  const Template = widgetInfo.template ? templatesMap[widgetInfo.template]! : () => null;

  const { products, features, recommended, color, unitLabel, subscribeLabel, freeTrialLabel, callbacks } = widgetInfo;
  const selectedEnv = callbacks.some((cb) => cb.env === env) ? env : undefined;

  return (
    <PricingThemeProvider
      cache={cache}
      color={color}
      colorScheme={colorScheme as any}
      withGlobalStyles={false}
      withNormalizeCSS={false}
    >
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
      />
    </PricingThemeProvider>
  );
};

class Wrapper extends HTMLElement {
  domRoot: ReactDOM.Root;

  props: Props = {
    cache: undefined,
    widget: undefined,
    env: undefined,
    theme: undefined,
    currency: undefined,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.domRoot = ReactDOM.createRoot(this.shadowRoot || this);
    this.props = {
      cache: createCache({
        key: 'pricing-cards',
        container: this.shadowRoot || this,
      }),
      env: this.getAttribute('env') || undefined,
      widget: this.getAttribute('widget') || undefined,
      theme: this.getAttribute('theme') || undefined,
      currency: this.getAttribute('currency') || undefined,
    };
  }

  render() {
    this.domRoot.render(<PricingCards {...this.props} />);
  }

  static get observedAttributes() {
    return ['theme', 'currency', 'widget', 'env'];
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

