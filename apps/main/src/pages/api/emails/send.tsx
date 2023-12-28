import type { NextApiRequest, NextApiResponse } from 'next';
import { VercelInviteUserEmail } from 'email-templates';

import { env } from 'env/server.mjs';
import { sendEmail } from 'utils/resend';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const baseUrl = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
  await sendEmail({
    to: 'alejandro@dealo.app',
    subject: 'Test',
    body: (
      <VercelInviteUserEmail
        logoImage={`${baseUrl}/emails/vercel-logo.png`}
        userImage={`${baseUrl}/emails/vercel-user.png`}
        teamImage={`${baseUrl}/emails/vercel-team.png`}
        arrowImage={`${baseUrl}/emails/vercel-arrow.png`}
      />
    ),
  });
  res.json({ src: 'success' });
}
