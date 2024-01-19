'use server';
import { LinearClient } from '@linear/sdk';

import { env } from 'env/server.mjs';

const linear = new LinearClient({
  apiKey: env.LINEAR_API_KEY,
});

export interface Report {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export async function postQuery(data: Report) {
  console.log('query', data);
}
