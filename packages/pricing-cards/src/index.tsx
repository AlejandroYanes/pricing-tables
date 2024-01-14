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
  useDarkTheme?: boolean;
  currency?: string;
  internal?: boolean;
}

const PricingCards = (props: Props) => {
  const { widget, currency, env, useDarkTheme, internal } = props;
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
    <div id="dealo-root" className={useDarkTheme ? 'dark' : undefined}>
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
        internal={internal}
        isMobile={calculateIsMobile(widgetInfo, window.innerWidth)}
      />
    </div>
  );
};

const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
class Wrapper extends HTMLElement {
  domRoot: ReactDOM.Root;
  mediaQuery: MediaQueryList;

  props: Props = {
    widget: undefined,
    env: undefined,
    useDarkTheme: false,
    currency: undefined,
    internal: false,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.domRoot = ReactDOM.createRoot(this.shadowRoot || this);
    this.mediaQuery = window.matchMedia(DARK_THEME_MEDIA_QUERY);
    this.props = {
      env: this.getAttribute('env') || undefined,
      widget: this.getAttribute('widget') || undefined,
      currency: this.getAttribute('currency') || undefined,
      internal: !!this.getAttribute('internal'),
      useDarkTheme: false,
    };
  }

  static get observedAttributes() {
    return ['theme', 'currency', 'widget', 'env', 'internal'];
  }

  resolveTheme() {
    const theme = this.getAttribute('theme');

    if (theme === 'dark' || theme === 'light') return theme;

    if (this.mediaQuery.matches) {
      return 'dark';
    }

    return 'light';
  }

  render() {
    this.props.useDarkTheme = this.resolveTheme() === 'dark';
    this.domRoot.render(<PricingCards {...this.props} />);
  }

  handleResize = () => {
    this.render();
  }

  handleThemeChange = () => {
    this.render();
  }

  connectedCallback() {
    window.addEventListener('resize', this.handleResize);
    this.mediaQuery.addEventListener('change', this.handleThemeChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    this.mediaQuery.removeEventListener('change', this.handleThemeChange);
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) return;
    if (newValue === (this.props as any)[name]) return;

    (this.props as any)[name] = newValue as any;
    this.render();
  }
}

customElements.define('pricing-cards', Wrapper);

export default PricingCards;
