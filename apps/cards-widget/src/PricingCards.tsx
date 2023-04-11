import { useEffect, useState } from 'react';
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client'
import { PricingThemeProvider } from 'ui';
import { BasicTemplate } from 'templates';
import { callAPI } from 'helpers';
import type { FormCallback, FormFeature, FormProduct } from 'models';

interface Props {
  widget: string;
  theme: 'system' | 'light' | 'dark';
  currency: string | null;
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
  const { widget, currency, theme: colorScheme = 'dark' } = props;
  const [widgetInfo, setWidgetInfo] = useState<WidgetInfo | undefined>(undefined);

  useEffect(() => {
    if (widget) {
      callAPI({
        url: `http://localhost:3000/api/widgets/${widget}`,
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

  const { products, features, recommended, color, unitLabel, subscribeLabel, freeTrialLabel, callbacks } = widgetInfo;

  return (
    <PricingThemeProvider colorScheme={colorScheme} withGlobalStyles={false} withNormalizeCSS={false}>
      <BasicTemplate
        features={features}
        products={products}
        recommended={recommended}
        color={color}
        currency={currency}
        unitLabel={unitLabel}
        subscribeLabel={subscribeLabel}
        freeTrialLabel={freeTrialLabel}
        callbacks={callbacks}
      />
    </PricingThemeProvider>
  );
};

class Wrapper extends HTMLElement {
  domRoot: ReactDOM.Root;
  props: Props = {
    widget: '',
    theme: 'system',
    currency: null,
  };

  constructor() {
    super();
    this.props = {
      widget: this.getAttribute('widget') || '',
      theme: (this.getAttribute('theme') || 'system') as any,
      currency: this.getAttribute('currency'),
    };
    this.domRoot = ReactDOM.createRoot(this);
  }

  render() {
    this.domRoot.render(<PricingCards {...this.props} />);
  }

  static get observedAttributes() {
    return ['theme', 'currency', 'widget'];
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

