/* eslint-disable max-len */
import { renderToNodeStream } from 'react-dom/server';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import type { Feature } from 'models';
import { PricingThemeProvider } from 'ui';
import { BasicTemplate } from 'templates';

const mockSelectedProducts = [
  {'id':'prod_NRrvBSQC0ZoHY7',object:'product','active':true,'attributes':[],'created':1677709893,'default_price':'price_1Mix29JIZhxRN8vVWAiQKwWu','description':'Basic plan description','images':[],'livemode':false,'metadata':{},'name':'Basic Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621196,'url':null,'prices':[{'id':'price_1Mix29JIZhxRN8vVWAiQKwWu','object':'price','active':true,'billing_scheme':'per_unit','created':1678182133,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvBSQC0ZoHY7','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':1000,'unit_amount_decimal':'1000'}],'features':[]},
  {'id':'prod_NRrvLHLkz1aSdI','object':'product','active':true,'attributes':[],'created':1677709939,'default_price':'price_1Mix3QJIZhxRN8vVmiM3xH4p','description':'Premium plan description','images':[],'livemode':false,'metadata':{},'name':'Premium Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621159,'url':null,'prices':[{'id':'price_1Mix3QJIZhxRN8vVmiM3xH4p','object':'price','active':true,'billing_scheme':'per_unit','created':1678182212,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':2500,'unit_amount_decimal':'2500'}],'features':[]},
  {'id':'prod_NRrwPguKtyHVRl','object':'product','active':true,'attributes':[],'created':1677709991,'default_price':'price_1Mix3vJIZhxRN8vV7cvEddpk','description':'Enterprise Plan description','images':[],'livemode':false,'metadata':{},'name':'Enterprise Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678182255,'url':null,'prices':[{'id':'price_1Mix3vJIZhxRN8vV7cvEddpk','object':'price','active':true,'billing_scheme':'per_unit','created':1678182243,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':5000,'unit_amount_decimal':'5000'}],'features':[]},
];

const mockFeatures: Feature[] = [
  { id: '1', 'name':'Unlimited private repos', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: true },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  { id: '2', 'name':'Jira software integration', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '3', 'name':'Required merge checks', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '4', 'name':'IP Whitelisting', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
];

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const cache = createCache({ key: 'pricing-cards-css' });
  const { extractCritical } = createEmotionServer(cache);
  const cacheProvider = (
    <CacheProvider value={cache}>
      <PricingThemeProvider colorScheme="dark" withNormalizeCSS={true} withGlobalStyles={true} emotionCache={cache}>
        <BasicTemplate
          features={mockFeatures}
          products={mockSelectedProducts as any}
          recommended="prod_NRrvLHLkz1aSdI"
          color="teal"
          subscribeLabel="Subscribe"
          freeTrialLabel="Free trial"
          callbacks={[
            { env: 'development', url: '' },
            { env: 'production', url: '' },
          ]}
        />
      </PricingThemeProvider>
    </CacheProvider>
  );

  const { html, css } = extractCritical(renderToNodeStream(cacheProvider).read() as any);
  const htmlStart = `
        <style id="pricing-cards-styles" data-emotion="css ${cache.key}">${css}</style>
        <div id="container">`;
  const htmlEnd = `</div>
      </body>
    </html>`;
  res.setHeader('Content-Type', 'text/html');
  res.write(htmlStart);
  res.write(html);
  res.write(htmlEnd);
  res.end();
}
