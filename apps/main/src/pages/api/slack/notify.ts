import type { NextApiRequest, NextApiResponse } from 'next';

import { authMiddleware } from 'utils/api';
import {
  notifyOfDeletedAccount,
  notifyOfFailedEmail,
  notifyOfInvoiceFailedToFinalize,
  notifyOfSubscriptionCancellation
} from 'utils/slack';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channel } = req.body;

  switch (channel) {
    case 'emails':
      await notifyOfFailedEmail({ email: 'test@email.com' });
      break;
    case 'invoices':
      await notifyOfInvoiceFailedToFinalize({
        name: 'Test',
        invoiceId: 'invoice-123',
        subscriptionId: 'subs-123',
        customerEmail: 'test@email.com',
      });
      break;
    case 'subs':
      await notifyOfSubscriptionCancellation({ name: 'Test' });
      break;
    case 'users':
      await notifyOfDeletedAccount({ name: 'Test', hadSubscription: false });
      break;
  }

  res.status(200).json({ received: true });
}

export default authMiddleware(handler);