/* eslint-disable max-len */
'use client'
import type { Session } from 'next-auth';
import { IconX } from '@tabler/icons-react';
import { formatStripeDate } from '@dealo/helpers';
import { Button } from '@dealo/ui';
import { useEffect, useState } from 'react';

interface Props {
  user: Session['user'];
  isSubscriptionSetToCancel: boolean;
}

export default function SubscriptionBanner(props: Props) {
  const { user, isSubscriptionSetToCancel } = props;
  const [showSubscriptionCancelAlert, setShowSubscriptionCancelAlert] = useState(isSubscriptionSetToCancel);

  useEffect(() => {
    setShowSubscriptionCancelAlert(isSubscriptionSetToCancel);
  }, [isSubscriptionSetToCancel]);

  if (isSubscriptionSetToCancel && showSubscriptionCancelAlert) {
    return (
      <div
        data-el="subscription-banner"
        className="peer fixed top-0 left-0 right-0 z-20 flex flex-row items-center justify-center h-[32px] py-1 px-4 bg-amber-500 dark:bg-amber-600"
      >
        <span className="text text-sm">
            Your subscription is set to cancel on {formatStripeDate(user!.subscriptionCancelAt!, 'en')}
        </span>
        <Button
          variant="undecorated"
          className="absolute top-0 right-0 bottom-0 h-[32px] rounded-none hover:bg-amber-500"
          onClick={() => setShowSubscriptionCancelAlert(false)}
        >
          <IconX size={14}/>
        </Button>
      </div>
    );
  }

  return null;
}
