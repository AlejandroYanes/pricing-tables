import React from 'react'
import ReactDOM from 'react-dom/client'
import './PricingCards';
import './globals.css';

ReactDOM.createRoot(document.getElementById('pricing-cards') as HTMLElement).render(
  <React.StrictMode>
    <div className="wrapper">
      {/* @ts-ignore */}
      <pricing-cards widget="clqs1ljxm0001jdfekgdizoxs" theme="light" currency="gbp" />
      {/*<App/>*/}
      <span style={{ marginTop: '48px' }}>Text to track heights</span>
    </div>
  </React.StrictMode>,
);
