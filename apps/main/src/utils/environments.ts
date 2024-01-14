import { env as clientEnv } from '../env/client.mjs';
import { env as serverEnv } from '../env/server.mjs';

export function isLocalhost () {
  return clientEnv.NEXT_PUBLIC_PLATFORM_URL === 'http://localhost:3000';
}

export function isDevelopment() {
  return !clientEnv.NEXT_PUBLIC_PLATFORM_URL || clientEnv.NEXT_PUBLIC_PLATFORM_URL === 'https://dev.dealo.app';
}

export function isProduction() {
  return clientEnv.NEXT_PUBLIC_PLATFORM_URL === 'https://dealo.app';
}

export function isLocalServer() {
  return serverEnv.PLATFORM_URL === 'http://localhost:3000';
}

export function isDevelopmentServer() {
  return serverEnv.PLATFORM_URL === 'https://dev.dealo.app';
}

export function isproductionServer() {
  return serverEnv.PLATFORM_URL === 'https://dealo.app';
}
