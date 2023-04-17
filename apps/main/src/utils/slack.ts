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

export function notifyOfNewSignup(data: Payload) {
  return sendNotification({
    text: `A new user just signed up:\n*${data.name}*\n`,
  });
}

export function notifyOfNewSetup(data: Payload) {
  return sendNotification({
    text: `A user just setup his account:\n*${data.name}*\n`,
  });
}

export function notifyOfDeletedAccount(data: Payload) {
  return sendNotification({
    text: `A user just deleted his account:\n*${data.name}*\n`,
  });
}
