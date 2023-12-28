import { Resend } from 'resend';

import { notifyOfFailedEmail } from './slack';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Payload {
  to: string;
  subject: string;
  body: JSX.Element;
}

export async function sendEmail(payload: Payload) {
  const { error } = await resend.emails.send({
    from: 'support@dealo.app',
    to: payload.to,
    subject: payload.subject,
    react: payload.body,
  });

  if (error) {
    console.log(`❌ Error sending email to ${payload.to}: ${error.message}`);
    notifyOfFailedEmail({ email: payload.to });
    // throw new Error(error.message);
  }
}
