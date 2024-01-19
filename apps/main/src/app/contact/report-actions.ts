'use server';
import { LinearClient } from '@linear/sdk';

import { env } from 'env/server.mjs';

const linear = new LinearClient({
  apiKey: env.LINEAR_API_KEY,
});

export interface Query {
  name: string;
  email: string;
  company: string;
  source: string;
  message: string;
  consent: boolean;
}

export async function postQuery(data: Query) {
  console.log('query', data);
}
