import { env } from 'env/client.mjs';

export function isDevelopment(): boolean {
  return !env.NEXT_PUBLIC_PLATFORM_URL || env.NEXT_PUBLIC_PLATFORM_URL === 'http://localhost:3000';
}

export function isProduction(): boolean {
  return env.NEXT_PUBLIC_PLATFORM_URL === 'https://dealo.app';
}
