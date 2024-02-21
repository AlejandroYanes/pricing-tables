import type { EdgeConfigValue } from '@vercel/edge-config';

import { env } from 'env/server.mjs';

export interface Update {
  operation: 'create' | 'update' | 'upsert' | 'delete';
  key: string;
  value: any;
}

export async function updateStore(items: Update[]) {
  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${env.EDGE_CONFIG_ID}/items?teamId=${env.VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      },
    );
    const data = await response.json();

    if ('error' in data) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(data.error.message);
    }
  } catch (error: any) {
    console.error('❌ Error updating edge config:', error.message);
  }
}

export async function getStoreItem<T = EdgeConfigValue>(key: string, tags?: string[]): Promise<T | undefined> {
  try {
    const response = await fetch(
      `https://edge-config.vercel.com/${env.EDGE_CONFIG_ID}/item/${key}?token=${env.EDGE_CONFIG_TOKEN}`,
      {
        next: { tags }
      },
    );
    const data = await response.json();

    if ('error' in data) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(data.error.message);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
