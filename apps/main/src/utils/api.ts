import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

type NextHandler = (req: NextApiRequest, res: NextApiResponse, session?: Session) => Promise<void>;

export const authMiddleware = (next: NextHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return next(req, res, session);
}

export const corsMiddleware = (next: NextHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
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
