export function isDevelopment(): boolean {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  return env !== 'production';
}
