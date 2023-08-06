import { useEffect, useState } from 'react';
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';

interface Props {
  widget?: string;
  env?: string;
  theme?: string;
  currency?: string;
}

const rootStyles = `
#root-wrapper {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;

        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;

        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;

        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;

        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;

        --primary: 222.2 47.4% 11.2%;
        --primary-foreground: 210 40% 98%;

        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;

        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;

        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;

        --ring: 215 20.2% 65.1%;

        --radius: 0.5rem;
      }

        .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;

        --muted: 217.2 32.6% 17.5%;
        --muted-foreground: 215 20.2% 65.1%;

        --popover: 222.2 84% 4.9%;
        --popover-foreground: 210 40% 98%;

        --card: 222.2 84% 4.9%;
        --card-foreground: 210 40% 98%;

        --border: 217.2 32.6% 17.5%;
        --input: 217.2 32.6% 17.5%;

        --primary: 210 40% 98%;
        --primary-foreground: 222.2 47.4% 11.2%;

        --secondary: 217.2 32.6% 17.5%;
        --secondary-foreground: 210 40% 98%;

        --accent: 217.2 32.6% 17.5%;
        --accent-foreground: 210 40% 98%;

        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 0 85.7% 97.3%;

        --ring: 217.2 32.6% 17.5%;
      }
`;

const PricingCards = (props: Props) => {
  const { widget, currency, env, theme: colorScheme = 'light' } = props;
  const [widgetInfo, setWidgetInfo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (widget) {
      const domain = import.meta.env.DEV ? 'http://localhost:3000' : 'https://dealo.app';
      const url = new URL(`${domain}/w/${widget}`);
      url.searchParams.set('theme', colorScheme);
      if (env) url.searchParams.set('env', env);
      if (currency) url.searchParams.set('currency', currency);

      fetch(url.toString())
        .then((res) => res.text())
        .then((res) => {
          const parser = new DOMParser();
          const domTree = parser.parseFromString(res, 'text/html');
          const scriptElements = domTree.querySelectorAll('script');
          const linkElements = domTree.querySelectorAll('link');

          scriptElements.forEach((script) => {
            const oldScriptPath = script.getAttribute('src');
            if (oldScriptPath && oldScriptPath.startsWith('/')) {
              script.setAttribute('src', `${domain}${oldScriptPath}`);
            }
          });

          linkElements.forEach((link) => {
            const oldLinkPath = link.getAttribute('href')!;
            if (oldLinkPath.startsWith('/')) {
              link.setAttribute('href', `${domain}${oldLinkPath}`);
            }
          });

          const modifiedDOM = domTree.querySelector('html')!.outerHTML;
          setWidgetInfo(modifiedDOM);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [widget]);

  if (!widgetInfo) return <span>No widget info</span>;

  return (
    <>
      <style>{rootStyles}</style>
      <div id="root-wrapper">
        <div dangerouslySetInnerHTML={{ __html: widgetInfo }} />
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

