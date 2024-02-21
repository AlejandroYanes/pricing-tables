import { env as serverEnv } from 'env/server.mjs';

export function isLocalServer() {
  return serverEnv.PLATFORM_URL === 'http://localhost:3000';
}

export function isNotStableServer() {
  return serverEnv.PLATFORM_URL !== 'https://dealo.app' && serverEnv.PLATFORM_URL !== 'https://dev.dealo.app';
}

export function isDevelopmentServer() {
  return serverEnv.PLATFORM_URL === 'https://dev.dealo.app';
}

export function isProductionServer() {
  return serverEnv.PLATFORM_URL === 'https://dealo.app';
}
