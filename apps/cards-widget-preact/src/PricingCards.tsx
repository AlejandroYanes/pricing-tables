import register from 'preact-custom-element';

const styles = (
  <style jsx>
    {`
      .container {
        position: relative;
        overflow: hidden;
        width: 980px;
        height: 420px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 80px;
      }

      /* Then style the iframe to fit in the container div with full height and width */
      .responsive-iframe {
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
      }

    `}
  </style>
);

const PricingCards = () => (
  <>
    {styles}
    <div className="container">
      <iframe className="responsive-iframe" src="http://localhost:3000/cards/simple" sandbox="allow-top-navigation"></iframe>
    </div>
  </>
);

register(PricingCards, 'pricing-cards', [], { shadow: false });

