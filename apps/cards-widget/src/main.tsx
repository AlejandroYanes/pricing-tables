import React from 'react'
import ReactDOM from 'react-dom/client'
import './PricingCards';
// import './globals.css';

ReactDOM.createRoot(document.getElementById('pricing-cards') as HTMLElement).render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <pricing-cards widget="clky0rlr70001jeahix5g38o2" theme="light" />
  </React.StrictMode>,
);
