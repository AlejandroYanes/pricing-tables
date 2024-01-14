export function isLocalhost () {
  console.log('process.env.NEXT_PUBLIC_VERCEL_ENV', process.env.NEXT_PUBLIC_VERCEL_ENV);
  return process.env.NEXT_PUBLIC_VERCEL_ENV === undefined;
}

export function isDevelopment() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  return !!env && env !== 'production';
}

export function isLocalServer() {
  return process.env.VERCEL_ENV === undefined;
}

export function isDevelopmentServer() {
  const env = process.env.VERCEL_ENV;
  return !!env && env !== 'production';
}
