import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { NewReleaseEmail } from '@dealo/email-templates';
import { ROLES } from '@dealo/models';

import { env } from 'env/server.mjs';
import { authMiddleware } from 'utils/api';
import initDb from 'utils/planet-scale';
import { sendEmail } from 'utils/resend';

const schema = z.object({
  from: z.string(),
  to: z.array(z.string()),
  subject: z.string(),
});

const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parseResult = schema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json(parseResult.error.message);
    return;
  }

  const { from, to, subject } = parseResult.data;

  const db = initDb();
  const users = (
    await db.execute('SELECT name, email FROM User WHERE id IN (?)', [to])
  ).rows as { name: string; email: string }[];

  users.forEach((user) => {
    sendEmail({
      from,
      to: user.email,
      subject,
      body: <NewReleaseEmail logoImage={logoImage} name={user.name} />,
    });
  });
  res.status(200).json({ success: true });
}

export default authMiddleware(handler, ROLES.ADMIN);
