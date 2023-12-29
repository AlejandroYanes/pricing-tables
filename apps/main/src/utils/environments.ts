export function isDevelopment(): boolean {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  console.log('env', env);
  return env !== 'production';
}
