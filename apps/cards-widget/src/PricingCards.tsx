/* eslint-disable max-len */
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client'
import { PricingThemeProvider } from 'ui';
import { BasicTemplate } from 'templates';
import { mockFeatures, mockSelectedProducts } from 'helpers';

interface Props {
  colorScheme: 'system' | 'light' | 'dark';
  currency: string | null;
}

const PricingCards = (props: Props) => {
  const { colorScheme = 'dark', currency = 'gbp' } = props;
  return (
    <PricingThemeProvider colorScheme={colorScheme} withGlobalStyles={true} withNormalizeCSS={false}>
      <BasicTemplate
        features={mockFeatures}
        products={mockSelectedProducts as any}
        recommended="prod_NRrvLHLkz1aSdI"
        color="indigo"
        currency={currency}
        unitLabel={null}
        subscribeLabel="Subscribe"
        freeTrialLabel="Free trial"
        callbacks={[
          { env: 'development', url: '' },
          { env: 'production', url: '' },
        ]}
      />
    </PricingThemeProvider>
  );
};

class Wrapper extends HTMLElement {
  domRoot: ReactDOM.Root;
  props: Props = {
    colorScheme: 'system',
    currency: null,
  };

  constructor() {
    super();
    this.props = {
      colorScheme: (this.getAttribute('theme') || 'system') as any,
      currency: this.getAttribute('currency'),
    };
    this.domRoot = ReactDOM.createRoot(this);
  }

  render() {
    this.domRoot.render(<PricingCards {...this.props} />);
  }

  static get observedAttributes() {
    return ['theme', 'currency'];
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

