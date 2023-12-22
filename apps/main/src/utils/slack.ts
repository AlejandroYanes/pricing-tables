import { env } from 'env/server.mjs';

function sendNotification(body: any) {
  return fetch(env.SLACK_USERS_CHANNEL, {
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
  return sendNotification({
    text: `A user just setup his account:\n*${data.name}*\n (With New Setup)`,
  });
}

interface DeletedPayload extends Payload {
  hadSubscription: boolean;
}

export function notifyOfDeletedAccount(data: DeletedPayload) {
  const { name, hadSubscription } = data;
  return sendNotification({
    text: `A user just deleted his account:\n*${name}*\n ${hadSubscription ? '(With Subscription)' : ''}`,
  });
}
