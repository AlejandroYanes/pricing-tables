import { env } from 'env/server.mjs';
import { formatStripeDate } from '@dealo/helpers';

function sendNotification(channel: string, body: any) {
  return fetch(channel, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

interface Payload {
  name: string;
  email: string;
}

export function notifyOfNewSetup(data: Payload) {
  return sendNotification(
    env.SLACK_USERS_CHANNEL,
    { text: `A user just setup his account (With New Setup):\n*${data.name}*\n*${data.email}*\n` }
  );
}

interface DeletedPayload extends Payload {
  hadSubscription: boolean;
}

export function notifyOfDeletedAccount(data: DeletedPayload) {
  const { name, hadSubscription } = data;
  return sendNotification(
    env.SLACK_USERS_CHANNEL,
    {
      text: `A user just deleted his account${hadSubscription ? '(With Subscription)' : ''}:\n*${name}*\n*${data.email}*\n`,
    },
  );
}

export function notifyOfNewSubscription(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just subscribed to the Paid Plan:\n*${data.name}*\n*${data.email}*\n`,
    },
  );
}

export function notifyOfSubscriptionMissingPaymentMethod(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `The subscription for this user is missing a payment method.\n*${data.name}*\n*${data.email}*`,
    },
  );
}

export function notifyOfSubscriptionPaused(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `The subscription for this user is paused.\n*${data.name}*\n*${data.email}*`,
    },
  );
}

export function notifyOfSubscriptionResumed(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `The subscription for this user is resumed.\n*${data.name}*\n*${data.email}*`,
    },
  );
}

export function notifyOfRenewedSubscription(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just renewed his subscription:\n*${data.name}${data.email}*\n`,
    },
  );
}

interface SoftCancellationPayload extends Payload {
  cancelAt: number;
}

export function notifyOfSubscriptionSoftCancellation(data: SoftCancellationPayload) {
  const cancelDate = formatStripeDate(data.cancelAt);
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just set his subscription to end:\n*${data.name}*\n*${data.email}*\n*${cancelDate}*\n`,
    },
  );
}

export function notifyOfSubscriptionCancellation(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `This user just cancelled his subscription.\n*${data.name}*\n*${data.email}*`,
    },
  );
}

interface MissingParamsPayload extends Payload {
  missingSubscription: boolean;
  missingCustomer: boolean;
}

export function notifyOfSubscriptionMissingParams(data: MissingParamsPayload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `A subscription for this user is missing params.\n*${data.name}*\n*${data.email}*\n*Missing Customer:${data.missingCustomer ? 'YES' : 'NO'}*\n*Missing Subscription:${data.missingSubscription ? 'YES' : 'NO'}*\n`,
    },
  );
}

interface PaymentFailedPayload extends Payload {
  subscriptionId: string;
}

export function notifyOfSubscriptionPaymentFailed(data: PaymentFailedPayload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `A payment for this user has failed.\n*${data.name}*\n*${data.email}*\n*Customer email:${data.email}*\n*Subscription ID:${data.subscriptionId}*\n`,
    },
  );
}

interface InvoicePayload extends Payload {
  invoiceId: string;
  subscriptionId: string;
}

export function notifyOfInvoiceFailedToFinalize(data: InvoicePayload) {
  return sendNotification(
    env.SLACK_INVOICES_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `An invoice for this user has failed to finalize.\n*${data.name}*\n*${data.email}*\nID: *${data.invoiceId}*\n*Subscription ID:${data.subscriptionId}*\n`,
    },
  );
}

export function notifyOfInvoicePaymentActionRequired(data: InvoicePayload) {
  return sendNotification(
    env.SLACK_INVOICES_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `An invoice for this user requires payment action.\n*${data.name}*\n*${data.email}*\nID: *${data.invoiceId}*\n*Subscription ID:${data.subscriptionId}*\n`,
    },
  );
}

interface EmailPayload {
  email: string;
}

export function notifyOfFailedEmail(data: EmailPayload) {
  return sendNotification(
    env.SLACK_EMAILS_CHANNEL,
    {
      text: `An email for this user has failed to send.\n*${data.email}*`,
    },
  );
}
