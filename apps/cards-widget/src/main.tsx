import React from 'react'
import ReactDOM from 'react-dom/client'
import '@dealo/pricing-cards';
import './globals.css';

ReactDOM.createRoot(document.getElementById('pricing-cards') as HTMLElement).render(
  <React.StrictMode>
    <div className="wrapper">
      {/*DEV widget*/}
      {/* @ts-ignore */}
      <pricing-cards widget="clpy5czwo0001hin5sqyyfhz4" theme="light" internal="true" />
      {/*PROD widget*/}
      {/*<pricing-cards widget="clqfkamjv0001121ffzdylrd3" theme="light" />*/}
      {/*<App/>*/}
      <span style={{ marginTop: '48px' }}>Text to track heights</span>
    </div>
  </React.StrictMode>,
);
