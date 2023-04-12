import { Stack, Text, Title, Code, Divider, Space } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useSession } from 'next-auth/react';

interface Props {
  widgetId: string;
}

const scriptCode = `<script src="https://pricing-tables-scripts.vercel.app/v0.0.1/pricing-cards.js"></script>`;
const widgetCode = (widgetId: string) => `<pricing-cards widget="${widgetId}"></script>`;
const wrappedWidgetCode = (widgetId: string) => `
<div class="pricing-widget__container">
    <pricing-cards widget="${widgetId}"></script>
</div>
`;
const widgetWithThemeCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" theme="light"></script>`;
const widgetWithCurrencyCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" currency="eur"></script>`;
const widgetWithEnvCode = (widgetId: string) => `<pricing-cards widget="${widgetId}" env="development"></script>`;

const requestBody = `{ widget_id: <...>, product_id: <...>, price_id: <...> }`;

const curlCommand = (apiKey: string) => `curl -X POST https://pricing-tables-main.vercel.app/api/client/retreive-stripe-info \\
     -H "X-Api-Key: ${apiKey}" \\
     -H "Content-Type: application/json" \\
     -d '{ "widget_id": "<widget_id>", "product_id": "<product_id>", "price_id": "<price_id>" }'
`;

const jsCommand = (apiKey: string) => `const url = 'https://pricing-tables-main.vercel.app/api/client/retreive-stripe-info';
const data = {
  widget_id: '<widget_id>',
  product_id: '<product_id>',
  price_id: '<price_id>'
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
    <Stack mx="auto" pt="xl" style={{ width: '100%', maxWidth: '800px' }}>
      <Title order={2} mb="xl">{`Here's`} how to integrate the widget with your app:</Title>

      <Text>
        First, add this script tag to your page,
        usually {`it's`} added at the bottom the head tag, though it can be added anywhere.
      </Text>
      <Prism language="markup">{scriptCode}</Prism>

      <Text mt="xl">
        then, add this custom tag to your code wherever you want the widget to show
        (these examples use this {`widget's`} id but you can use any id you want)
      </Text>
      <Prism language="markup">{widgetCode(widgetId)}</Prism>

      <Text mt="xl">We recommend wrapping the widget in a container to make positioning easier</Text>
      <Prism language="markup">{wrappedWidgetCode(widgetId)}</Prism>

      <Title order={3} mt="xl">Other configurations</Title>

      <Text>
        there are some extra attributes you can pass to the widget tag to customise it,
        like theme and currency, {`here's`} how
      </Text>

      <Text mt="xl" weight="bold">Theme</Text>
      <Text>The theme attribute expects one of three values: <Code>system | light | dark</Code></Text>
      <Prism language="markup" mb="xl">{widgetWithThemeCode(widgetId)}</Prism>

      <Text weight="bold">Currency</Text>
      <Text>
        If your prices are setup with more than one currency you can specify which one to use.
        If you {`don't`} specify a currency it will use the default currency of your Stripe account.
      </Text>
      <Prism language="markup" mb="xl">{widgetWithCurrencyCode(widgetId)}</Prism>

      <Text weight="bold">Environment</Text>
      <Text>
        We support having multiple environments for your widget
        in case you want to use it while testing your app.
        Most of the time you will only use one environment, but just in case, our custom tag supports an <Code>env</Code> attribute.
        <br />
        <br />
        The value of this attribute should be the name of the environment you want to use.
        By default it will use the <Code>production</Code> environment.
      </Text>
      <Prism language="markup" mb="xl">{widgetWithEnvCode(widgetId)}</Prism>

      <Divider mt="xl" />

      <Title order={2} mt="xl">How it works</Title>
      <Text>
        Now {`let's`} get into how the integration works.
        <br />
        When a user click on the button to select a product,
        it will redirect them to whatever url you set in the callback section of the <Code>Settings</Code> panel.
        If you leave the url empty ti will just add the product and price <Code>ids</Code> to the page url.
        <br />
        <br />
        An example of this flow would be to redirect the user to your sign up page and after they enter their information and submit it,
        as part of your signup flow you can make a request to our API to get the product and price <Code>ids</Code>.
        <br />
        <br />
        The <Code>ids</Code> that we add to the url will not be the real ones from Stripe,
        but rather a hash that we generate, this is for security reasons.
        In order to get the real <Code>ids</Code> you will need to make a request to our API.
      </Text>
      <Prism language="markup">{`https://pricing-tables-main.vercel.app/api/client/retreive-stripe-info`}</Prism>
      <Text mt="md">
        This request needs to be a <Code>POST</Code> request with the body:
        <Prism language="json">{requestBody}</Prism>
        <br />
        It will return an object with the real <Code>ids</Code> for the product and price.
      </Text>
      <Text>The request also needs this API Key header to validate {`it's`} you {`who's`} making the request</Text>
      <Prism language="markup">{`X-Api-Key=${data?.user?.id}`}</Prism>
      <Text>{`Here's`} how it would look</Text>
      <Prism language="bash">{curlCommand(data!.user!.id)}</Prism>
      <Text mt="md">{`Here's`} a JavaScript version</Text>
      <Prism language="bash">{jsCommand(data!.user!.id)}</Prism>
      <Space h="xl" />
    </Stack>
  );
}
