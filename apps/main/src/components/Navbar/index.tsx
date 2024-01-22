/* eslint-disable max-len */
'use client'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import { cn, HoverCard, HoverCardContent, HoverCardTrigger, RenderIf, } from '@dealo/ui';

import NavbarLink from './NavbarLink';
import UserMenu from './UserMenu';
import SubscriptionBanner from './SubscriptionBanner';

export { NavbarLink };

interface Props {
  title?: string;
  showBackButton?: boolean;
  hideUserControls?: boolean;
  backRoute?: string;
  className?: string;
}

export default function Navbar(props: Props) {
  const { showBackButton = false, hideUserControls, title, backRoute, className } = props;
  const { status, data } = useSession();
  const hasSubscription = (
    data?.user?.subscriptionStatus === 'active' ||
    data?.user?.subscriptionStatus === 'trialing' ||
    data?.user?.subscriptionStatus === 'paused'
  );
  const isSubscriptionSetToCancel = hasSubscription && !!data?.user?.subscriptionCancelAt;

  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      <SubscriptionBanner user={data?.user} isSubscriptionSetToCancel={isSubscriptionSetToCancel} />
      <header
        className={cn(
          'h-16 flex justify-start items-center mb-6 z-10 peer-data-[el=subscription-banner]:mt-[32px]',
          className,
        )}
      >
        <RenderIf condition={showBackButton}>
          <NavbarLink
            className="mr-4"
            icon={IconArrowLeft}
            onClick={() => backRoute ? router.push(backRoute) : router.back()}
          />
        </RenderIf>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <RenderIf condition={!hideUserControls && status === 'authenticated'}>
          <div className="flex items-center gap-4 ml-auto">
            <HoverCard>
              <HoverCardTrigger>
                <NavbarLink asSpan icon={IconInfoCircle}/>
              </HoverCardTrigger>
              <HoverCardContent align="end" className="w-[280px] mt-3">
                <p className="text text-black dark:text-white">
                  This platform is still an alpha version, so if you find any bugs or have any suggestions,
                  please let me know at
                  {' '}
                  <a href="mailto:alejandro@dealo.app" className="text-emerald-500">
                    support@dealo.app
                  </a>
                  !
                </p>
              </HoverCardContent>
            </HoverCard>
            <UserMenu user={data?.user} hasSubscription={hasSubscription}/>
          </div>
        </RenderIf>
      </header>
    </>
  );
}
