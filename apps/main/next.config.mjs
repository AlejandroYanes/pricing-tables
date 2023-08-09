// @ts-check
import initAnalyzer from '@next/bundle-analyzer';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

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
  transpilePackages: ["@dealo/ui", "@dealo/templates", "@dealo/helpers", "@dealo/models"],
  headers: async () => [
    {
      // this will match `/english(default)/something` being requested
      source: '/w/:id*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
      ],
    },
    {
      // this will match `/english(default)/something` being requested
      source: '/',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
      ],
    },
  ],
};
export default withBundleAnalyzer(config);
