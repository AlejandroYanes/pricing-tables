import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

type NextHandler = (req: NextApiRequest, res: NextApiResponse, session: Session) => Promise<void>;

export const authMiddleware = (next: NextHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return next(req, res, session);
}
