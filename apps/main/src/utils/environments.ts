export function isLocalhost () {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === undefined;
}

export function isDevelopment() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  return !!env && env !== 'production';
}
