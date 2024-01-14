import type { NextApiRequest, NextApiResponse } from 'next';
import { type AuthenticatedSession, getServerSession } from 'next-auth';
import type Stripe from 'stripe';

import { env as serverEnv } from 'env/server.mjs';
import { authOptions } from './auth';
import initStripe from './stripe';

function isLocalServer() {
  return serverEnv.PLATFORM_URL === 'http://localhost:3000';
}

export type AuthenticatedHandler = (req: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) => Promise<void>;

export const authMiddleware = (next: AuthenticatedHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const authenticatedSession = { ...session, user: session.user! } as AuthenticatedSession;

  return next(req, res, authenticatedSession);
}

type CorsHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const corsMiddleware = (next: CorsHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Api-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return next(req, res);
}

export type StripeEventHandler = (req: NextApiRequest, res: NextApiResponse, event: Stripe.Event) => Promise<void>;

export const stripeEventMiddleware = (next: StripeEventHandler, secret: string) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (isLocalServer()) {
    return next(req, res, req.body as Stripe.Event);
  }

  const signature = req.headers['stripe-signature']!;
  const stripe = initStripe();

  try {
    const payload = await buffer(req);
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return next(req, res, event);
  } catch (err: any) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};
