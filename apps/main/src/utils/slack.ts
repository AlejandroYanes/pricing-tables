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
      text: `The subscription for user *${data.name}* has been cancelled.`,
    },
  );
}
