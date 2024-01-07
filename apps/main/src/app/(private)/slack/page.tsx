'use client';
import { Button } from '@dealo/ui';
import { callAPI } from '@dealo/helpers';

import BaseLayout from 'components/BaseLayout';

const SlackPage = () => {
  const triggerSlackNotification = (channel: string) => {
    callAPI({
      url: '/api/slack/notify',
      method: 'POST',
      body: {
        channel: channel,
      },
    });
  };
  return (
    <BaseLayout showBackButton backRoute="/">
      <div className="max-w-[700px] mx-auto pt-24 flex flex-col">
        <h1 className="text-3xl">Slack test</h1>
        <div className="mt-24 flex items-center justify-around gap-4">
          <Button onClick={() => triggerSlackNotification('emails')}>Emails Channel</Button>
          <Button onClick={() => triggerSlackNotification('invoices')}>Invoices Channel</Button>
          <Button onClick={() => triggerSlackNotification('subs')}>Subscriptions Channel</Button>
          <Button onClick={() => triggerSlackNotification('users')}>Users Channel</Button>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SlackPage;
