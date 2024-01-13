import { Resend } from 'resend';
import {
  AccountDeletedEmail,
  FailedPaymentEmail,
  SubscriptionCancelledEmail,
  SubscriptionCreatedEmail,
  WelcomeEmail
} from '@dealo/email-templates';

import { env } from 'env/server.mjs';
import { notifyOfFailedEmail } from './slack';

const resend = new Resend(env.RESEND_API_KEY);
const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

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
  withTrial: boolean;
  trialEndsAt?: number;
}

export function sendWelcomeEmail(payload: WelcomeEmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Welcome to Dealo!',
    body: (
      <WelcomeEmail
        name={payload.name}
        logoImage={logoImage}
        withSubscription={payload.withSubscription}
        withTrial={payload.withTrial}
        trialEndsAt={payload.trialEndsAt}
      />
    ),
  });
}

export function sendFailedPaymentEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Failed payment',
    body: (
      <FailedPaymentEmail name={payload.name} logoImage={logoImage} />
    ),
  });
}

export function sendSubscriptionCreatedEmail(payload: EmailPayload) {
  return sendEmail({
    to: 'support@dealo.app',
    subject: 'New Subscription!!!',
    body: (
      <SubscriptionCreatedEmail name={payload.name} email={payload.to} logoImage={logoImage} />
    ),
  });
}

export function sendSubscriptionCancelledEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Subscription cancelled',
    body: (
      <SubscriptionCancelledEmail name={payload.name} logoImage={logoImage} />
    ),
  });
}

export function sendAccountDeletedEmail(payload: EmailPayload) {
  return sendEmail({
    to: payload.to,
    subject: 'Account deleted',
    body: <AccountDeletedEmail name={payload.name} logoImage={logoImage} />,
  });
}
