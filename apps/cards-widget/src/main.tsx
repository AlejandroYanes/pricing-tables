import React from 'react'
import ReactDOM from 'react-dom/client'
import './PricingCards';

ReactDOM.createRoot(document.getElementById('pricing-cards') as HTMLElement).render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <pricing-cards theme="light" />
  </React.StrictMode>,
);
