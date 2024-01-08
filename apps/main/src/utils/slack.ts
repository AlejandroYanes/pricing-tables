import { env } from 'env/server.mjs';

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
}

export function notifyOfNewSetup(data: Payload) {
  return sendNotification(
    env.SLACK_USERS_CHANNEL,
    { text: `A user just setup his account:\n*${data.name}*\n (With New Setup)` }
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
      text: `A user just deleted his account:\n*${name}*\n ${hadSubscription ? '(With Subscription)' : ''}`,
    },
  );
}

export function notifyOfNewSubscription(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just subscribed to the Paid Plan:\n*${data.name}*\n`,
    },
  );
}

export function notifyOfRenewedSubscription(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just renewed his subscription:\n*${data.name}*\n`,
    },
  );
}

interface SoftCancellationPayload extends Payload {
  cancelAt: number;
}

export function notifyOfSubscriptionSoftCancellation(data: SoftCancellationPayload) {
  const cancelDate = new Date(data.cancelAt).toLocaleDateString('en-Gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `A user just set his subscription to end:\n*${data.name}*\n\n*${cancelDate}*\n`,
    },
  );
}

export function notifyOfSubscriptionCancellation(data: Payload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      text: `User *${data.name}* just cancelled his subscription.`,
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
      text: `A subscription for user *${data.name}* is missing params.\n*Missing Customer:${data.missingCustomer ? 'YES' : 'NO'}*\n\n*Missing Subscription:${data.missingSubscription ? 'YES' : 'NO'}*\n`,
    },
  );
}

interface PaymentFailedPayload extends Payload {
  subscriptionId: string;
  customerEmail: string;
}

export function notifyOfSubscriptionPaymentFailed(data: PaymentFailedPayload) {
  return sendNotification(
    env.SLACK_SUBSCRIPTIONS_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `A payment for user *${data.name}* has failed.\n*Customer email:${data.customerEmail}*\n\n*Subscription ID:${data.subscriptionId}*\n`,
    },
  );
}

interface InvoicePayload extends Payload {
  invoiceId: string;
  subscriptionId: string;
  customerEmail: string;
}

export function notifyOfInvoiceFailedToFinalize(data: InvoicePayload) {
  return sendNotification(
    env.SLACK_INVOICES_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `An invoice (ID: *${data.invoiceId}*) for user *${data.name}* has failed to finalize.\n*Customer email:${data.customerEmail}*\n\n*Subscription ID:${data.subscriptionId}*\n`,
    },
  );
}

export function notifyOfInvoicePaymentActionRequired(data: InvoicePayload) {
  return sendNotification(
    env.SLACK_INVOICES_CHANNEL,
    {
      // eslint-disable-next-line max-len
      text: `An invoice (ID: *${data.invoiceId}*) for user *${data.name}* requires payment action.\n*Customer email:${data.customerEmail}*\n\n*Subscription ID:${data.subscriptionId}*\n`,
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
      text: `An email for *${data.email}* has failed to send.`,
    },
  );
}
