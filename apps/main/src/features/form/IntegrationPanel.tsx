import { Prism } from '@mantine/prism';
import { useSession } from 'next-auth/react';

import { Separator } from 'components/ui/separator';
import Code from 'components/ui/code';
import CodeBlock from 'components/ui/code-block';

interface Props {
  widgetId: string;
}

const scriptCode = `<script src="https://scripts.dealo.app/v0.0.1/pricing-cards.js"></script>`;
const widgetCode = (widgetId: string) => `<pricing-cards widget="${widgetId}"></pricing-cards>`;
const wrappedWidgetCode = (widgetId: string) => `
<div class="pricing-widget__container">
    <pricing-cards widget="${widgetId}"></script>
</div>
`;
const widgetWithThemeCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" theme="light"></script>`;
const widgetWithCurrencyCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" currency="eur"></script>`;
const widgetWithEnvCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" env="development"></script>`;

const requestBody = () => `{ widget_id: <...>, product_id: <...>, price_id: <...> }`;

// eslint-disable-next-line max-len
const curlCommand = (apiKey: string) => `
curl -X POST https://dealo.app/api/client/retreive-stripe-info \\
     -H "X-Api-Key: ${apiKey}" \\
     -H "Content-Type: application/json" \\
     -d '{ "widget_id": "<...>", "product_id": "<...>", "price_id": "<...>" }'
`;

// eslint-disable-next-line max-len
const jsCommand = (apiKey: string) => `
const url = 'https://dealo.app/api/client/retreive-stripe-info';
const data = {
  widget_id: '<...>',
  product_id: '<...>',
  price_id: '<...>'
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': '${apiKey}'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
`;

export default function IntegrationPanel(props: Props) {
  const { widgetId } = props;
  const { data } = useSession();

  return (
    <div className="flex flex-col mx-auto pt-6 w-full max-w-[800px]">
      <h2 className="text text-2xl font-bold mt-6 mb-2">{`Here's`} how to integrate the widget with your app:</h2>

      <p className="text m-0">
        First, add this script tag to your page,
        usually {`it's`} added at the bottom the head tag, though it can be added anywhere.
      </p>
      <Prism language="markup">{scriptCode}</Prism>

      <p className="mt-6 mb-0 mx-0">
        then, add this custom tag to your code wherever you want the widget to show
        (these examples use this {`widget's`} id but you can use any id you want)
      </p>
      <Prism language="markup">{widgetCode(widgetId)}</Prism>

      <p className="mt-6 mb-0 mx-0">We recommend wrapping the widget in a container to make positioning easier</p>
      <Prism language="markup">{wrappedWidgetCode(widgetId)}</Prism>

      <h3 className="text text-xl font-semibold mt-6 mb-2">Other configurations</h3>

      <p className="m-0">
        there are some extra attributes you can pass to the widget tag to customise it,
        like theme and currency, {`here's`} how
      </p>

      <span className="text font-semibold mt-6">Theme</span>
      <p className="m-0">The theme attribute expects one of three values: <Code>system | light | dark</Code></p>
      <Prism language="markup" mb="xl">{widgetWithThemeCode(widgetId)}</Prism>

      <span className="text font-semibold mt-6">Currency</span>
      <p className="m-0">
        If your prices are setup with more than one currency you can specify which one to use.
        If you {`don't`} specify a currency it will use the default currency of your Stripe account.
      </p>
      <Prism language="markup" mb="xl">{widgetWithCurrencyCode(widgetId)}</Prism>

      <span className="text font-semibold mt-6">Environment</span>
      <p className="m-0">
        We support having multiple environments for your widget
        in case you want to use it while testing your app.
        Most of the time you will only use one environment, but just in case, our custom tag supports an <Code>env</Code> attribute.
        <br />
        <br />
        The value of this attribute should be the name of the environment you want to use.
        By default it will use the <Code>production</Code> environment.
      </p>
      <Prism language="markup" mb="xl">{widgetWithEnvCode(widgetId)}</Prism>

      <Separator className="mt=6" />

      <h2 className="text text-2xl font-bold mt-6 mb-2">How it works</h2>
      <p className="m-0">
        Now {`let's`} get into how the integration works.
        <br />
        When a user click on the button to select a product,
        it will redirect them to whatever url you set in the callback section of the <Code>Settings</Code> panel,
        and add query parameters to identify the widget, product, price and currency selected.
        If you leave the url empty it will just add the parameters to the page url.
        Eg:
        <Prism language="javascript" mt="md">
          {`https://your-page.com/?widget_id=<...>&product_id=<...>&price_id=<...>&currency=gbp`}
        </Prism>
        <br />
        This is done so you can use your own signup flow before collecting the payment.
        From here there you can either:
        <ul className="list-disc pl-8 pt-4">
          <li>
            use our <Code>checkout</Code> API route and we will generate a Stripe checkout session for your customer
          </li>
          <li>
            use our API route to get the real product and price <Code>ids</Code>
          </li>
        </ul>
      </p>
      <h3 className="text text-xl font-semibold mt-6 mb-2">Generating a Stripe Checkout</h3>
      <p className="m-0">
        To generate a Stripe checkout session you need redirect the user to our <Code>checkout</Code> API route.
        Make sure to add the query parameters we added to your page to the url.
      </p>
      <Prism language="javascript">
        {`https://dealo.app/api/stripe/checkout?widget_id=<...>&product_id=<...>&price_id=<...>&currency=gbp`}
      </Prism>
      <p>
        This will automatically create a Stripe checkout session and redirect the user to the Stripe checkout page.
        After the payment is completed, Stripe will redirect the user to the URLs you have setup on the <Code>Settings</Code> panel,
        or we will redirect them to the same page they were before (the one that initiated the checkout).
        <br />
        If {`we're`} not able to find the page that initiated the checkout,
        we will redirect the user to our own pages that will show a success or error message (though this should never happen).
      </p>
      <h3 className="text text-xl font-semibold mt-6 mb-2">Using our API route to retrieve the information</h3>
      <p>
        The other option is to use our API route to get the real product and price <Code>ids</Code>
        and then create the checkout session yourself.
        <br />
        The <Code>ids</Code> that we add to the url will not be the real ones from Stripe,
        but rather a hash that we generate, this is for security reasons.
        In order to get the real <Code>ids</Code> you will need to make a request to our API.
      </p>
      <Prism language="javascript">{`https://dealo.app/api/client/retreive-stripe-info`}</Prism>
      <p className="mt-6">
        This request needs to be a <Code>POST</Code> request with the body:
        <Prism language="json">{requestBody()}</Prism>
        <br />
        It will return an object with the real <Code>ids</Code> for the product and price.
      </p>
      <p className="mt-6 mb-4">The request also needs this API Key header to validate {`it's`} you {`who's`} making the request</p>
      <CodeBlock code={`X-Api-Key=${data?.user?.id}`} />
      <p className="mt-6">{`Here's`} how it would look</p>
      <CodeBlock code={curlCommand(data!.user!.id)} />
      <p className="mt-6">{`Here's`} a JavaScript version</p>
      <CodeBlock code={jsCommand(data!.user!.id)} />
    </div>
  );
}
