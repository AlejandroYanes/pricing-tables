/* eslint-disable max-len */
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  IconArrowLeft,
  IconInfoCircle,
  IconLogout,
  IconSettings,
  IconTrash,
  IconUser,
  IconUsers,
  IconReceipt,
  IconX,
} from '@tabler/icons-react';
import {
  RenderIf,
  Button,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  cn,
} from '@dealo/ui';
import { formatDate } from '@dealo/helpers';
import { ROLES } from '@dealo/models';

import { trpc } from 'utils/trpc';
import NavbarLink from './NavbarLink';

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
  const isSubscriptionSetToCancel = data?.user?.hasSubscription && !!data?.user?.subscriptionCancelAt;

  const router = useRouter();

  const [showDeleteAccountModal, setShowModal] = useState(false);
  const [showSubscriptionCancelAlert, setShowSubscriptionCancelAlert] = useState(isSubscriptionSetToCancel);

  const { mutate: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => handleLogout(),
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleDeleteAccount = async () => {
    setShowModal(true);
  };

  useEffect(() => {
    setShowSubscriptionCancelAlert(isSubscriptionSetToCancel);
  }, [isSubscriptionSetToCancel]);

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'h-16 flex justify-start items-center mb-6 z-10',
          { 'mt-[32px]': isSubscriptionSetToCancel && showSubscriptionCancelAlert },
          className,
        )}
      >
        <RenderIf condition={showBackButton}>
          <NavbarLink className="mr-4" icon={IconArrowLeft} onClick={() => backRoute ? router.push(backRoute) : router.back()}  />
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <NavbarLink asSpan icon={IconUser}/>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mt-3">
                <RenderIf condition={data?.user?.role === ROLES.ADMIN}>
                  <DropdownMenuLabel>Management</DropdownMenuLabel>
                  <Link href="/users">
                    <DropdownMenuItem>
                      <IconUsers size={16} className="mr-2"/>
                      Manage Users
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                </RenderIf>
                <DropdownMenuLabel>{data?.user?.name}</DropdownMenuLabel>
                <RenderIf
                  condition={!!data?.user?.hasSubscription}
                  fallback={
                    <Link href="/pricing">
                      <DropdownMenuItem>
                        <IconReceipt size={14} className="mr-2" />
                        Pricing
                      </DropdownMenuItem>
                    </Link>
                  }
                >
                  <Link href="/api/stripe/customer/portal">
                    <DropdownMenuItem>
                      <IconReceipt size={14} className="mr-2" />
                      Customer Portal
                    </DropdownMenuItem>
                  </Link>
                </RenderIf>
                <DropdownMenuItem>
                  <IconSettings size={16} className="mr-2"/>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <IconLogout size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
                <DropdownMenuItem destructive onClick={handleDeleteAccount}>
                  <IconTrash size={16} className="mr-2"/>
                  Delete my account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </RenderIf>
      </header>
      {isSubscriptionSetToCancel && showSubscriptionCancelAlert ? (
        <div className="fixed top-0 left-0 right-0 z-20 flex flex-row items-center justify-center h-[32px] py-1 px-4 bg-amber-500 dark:bg-amber-600">
          <span className="text text-sm">
            Your subscription is set to cancel on {formatDate(new Date(data!.user!.subscriptionCancelAt!), 'en')}
          </span>
          <Button
            variant="undecorated"
            className="absolute top-0 right-0 bottom-0 h-[32px] rounded-none hover:bg-amber-500"
            onClick={() => setShowSubscriptionCancelAlert(false)}
          >
            <IconX size={14} />
          </Button>
        </div>
      ) : null}
      <RenderIf condition={showDeleteAccountModal}>
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="pb-4">
                Are you sure you want to delete your account?
                We promise we {`won't`} keep any data about you but you will also loose everything {`you've`} created with us,
                and this action is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowModal(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => deleteAccount()}
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </RenderIf>
    </>
  );
}
