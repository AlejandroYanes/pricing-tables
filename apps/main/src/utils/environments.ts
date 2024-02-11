import { env as serverEnv } from 'env/server.mjs';

export function isLocalServer() {
  return serverEnv.PLATFORM_URL === 'http://localhost:3000';
}

export function isProductionServer() {
  return serverEnv.PLATFORM_URL === 'https://dealo.app';
}
