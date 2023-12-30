// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';
import { useEffect, useRef } from 'react';

interface Props {
  widget?: string;
  env?: string;
  theme?: string;
  currency?: string;
  internal?: boolean;
}

const rootStyles = `
  .pricing-cards__root {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .pricing-cards__iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const PricingCards = (props: Props) => {
  const { widget, currency, env, theme: colorScheme = 'light', internal } = props;
  const rootElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window) return;

    window.addEventListener('message', (event) => {
      const { data } = event;
      if (data.source !== 'pricing-widget__size') return;
      const { width, height } = data;
      const rootEl = rootElRef.current;
      if (!rootEl) return;
      console.log(rootEl, width, height);
      rootEl.style.height = `${height}px`;
      rootEl.style.width = `${width}px`;
    }, false);
  }, []);

  const windowWidth = window.innerWidth;
  const currentUrl = new URL(window.location.href);
  const fetchUrl = internal ? currentUrl.origin : `https://www.dealo.app`;
  const src = `${fetchUrl}/w/${widget}?env=${env}&theme=${colorScheme}&currency=${currency}&width=${windowWidth}`;

  return (
    <>
      <style>{rootStyles}</style>
      <div ref={rootElRef} className="pricing-cards__root">
        <iframe
          title="Pricing Card"
          className="pricing-cards__iframe"
          src={src}
        />
      </div>
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

