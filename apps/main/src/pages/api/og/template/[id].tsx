/* eslint-disable max-len */
import { ImageResponse } from '@vercel/og';
import type { NextApiRequest } from 'next';
import { BasicTemplate } from 'templates';
import { PricingThemeProvider } from 'ui';
import { mockFeatures, mockSelectedProducts } from 'helpers';

export const config = {
  runtime: 'experimental-edge',
};

export default async function buildOGImageForTemplate(req: NextApiRequest) {
  const { id } = req.query;

  return new ImageResponse(
    (
      <html>
        <head />
        <body>
          <div
            style={{
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              padding: '48px',
            }}
          >
            <PricingThemeProvider colorScheme="light" withGlobalStyles={false} withNormalizeCSS={false}>
              <BasicTemplate
                features={mockFeatures}
                products={mockSelectedProducts as any}
                recommended="prod_NRrvLHLkz1aSdI"
                color="indigo"
                unitLabel={null}
                subscribeLabel="Subscribe"
                freeTrialLabel="Free trial"
                callbacks={[
                  { env: 'development', url: '' },
                  { env: 'production', url: '' },
                ]}
              />
            </PricingThemeProvider>
          </div>
        </body>
      </html>
    ),
    {
      width: 800,
      height: 300,
    },
  );
}
