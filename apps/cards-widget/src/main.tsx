import React from 'react'
import ReactDOM from 'react-dom/client'
import './PricingCards';
// import './globals.css';

const rootStyles = `
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: 0 auto;
  }
`;

ReactDOM.createRoot(document.getElementById('pricing-cards') as HTMLElement).render(
  <React.StrictMode>
    {/* @ts-ignore */}
    {/*<pricing-cards widget="clky0rlr70001jeahix5g38o2" theme="light" currency="gbp" />*/}
    <style>{rootStyles}</style>
    <div className="wrapper">
      {/* @ts-ignore */}
      <pricing-cards widget="clky0rlr70001jeahix5g38o2" theme="light" currency="gbp"/>
      {/*<div id="root-pricing-cards__root" className="pricing-cards__root">*/}
      {/*  <iframe*/}
      {/*    title="Pricing Card"*/}
      {/*    id="root-pricing-cards__iframe"*/}
      {/*    className="pricing-cards__iframe"*/}
      {/*    src={`http://localhost:3000/w/clqs1ljxm0001jdfekgdizoxs?env=development&theme=light&currency=gbp`}*/}
      {/*  />*/}
      {/*</div>*/}
      <span>Text to track heights</span>
    </div>
  </React.StrictMode>,
);
