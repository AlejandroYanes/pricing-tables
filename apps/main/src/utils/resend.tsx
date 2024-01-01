import { Resend } from 'resend';
import { AccountDeletedEmail, FailedPaymentEmail, SubscriptionCancelledEmail, WelcomeEmail } from '@dealo/email-templates';

import { notifyOfFailedEmail } from './slack';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Payload {
  to: string;
  subject: string;
  body: JSX.Element;
}

async function sendEmail(payload: Payload) {
  const { error } = await resend.emails.send({
    from: 'support@dealo.app',
    to: payload.to,
    subject: payload.subject,
    react: payload.body,
  });

  if (error) {
    console.log(`❌ Error sending email to ${payload.to}: ${error.message}`);
    // noinspection ES6MissingAwait
    notifyOfFailedEmail({ email: payload.to });
    // throw new Error(error.message);
  }
}

interface EmailPayload {
  to: string;
  name: string;
}

interface WelcomeEmailPayload extends EmailPayload {
  withSubscription: boolean;
}

export function sendWelcomeEmail(payload: WelcomeEmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Welcome to Dealo!',
    body: <WelcomeEmail name={payload.name} withSubscription={payload.withSubscription} logoImage="/logo/dealo_logo_block.png" />,
  });
}

export function sendFailedPaymentEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Failed payment',
    body: <FailedPaymentEmail name={payload.name} logoImage="/logo/dealo_logo_block.png" />,
  });
}

export function sendSubscriptionCancelledEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Subscription cancelled',
    body: <SubscriptionCancelledEmail name={payload.name} logoImage="/logo/dealo_logo_block.png" />,
  });
}

export function sendAccountDeletedEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Account deleted',
    body: <AccountDeletedEmail name={payload.name} logoImage="/logo/dealo_logo_block.png" />,
  });
}
