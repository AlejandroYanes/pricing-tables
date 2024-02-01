// @ts-check
import initAnalyzer from '@next/bundle-analyzer';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));
import { withAxiom } from 'next-axiom';

import configMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const withMDX = configMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [],
  },
});

const withBundleAnalyzer = initAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  pageExtensions: ['mdx', 'ts', 'tsx'],
  transpilePackages: ["@dealo/ui", "@dealo/templates", "@dealo/helpers", "@dealo/models", "@dealo/email-templates"],
};
export default withBundleAnalyzer(withAxiom(withMDX(config)));
