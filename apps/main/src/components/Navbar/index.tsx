'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { type AuthenticatedSession } from 'next-auth';
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
  type Icon as TablerIcon,
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

interface NavbarLinkProps {
	icon: TablerIcon;
	onClick?(): void;
  asSpan?: boolean;
  className?: string;
}

const NavbarLink = ({ icon: Icon, onClick, asSpan, className }: NavbarLinkProps) => {
  if (asSpan) {
    return (
      <Button
        onClick={onClick}
        component="span"
        variant="ghost"
        className={cn('h-[50px] w-[50px] p-0 flex justify-center items-center rounded-lg', className)}
      >
        <Icon size={24} stroke={1.5} />
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn('h-[50px] w-[50px] p-0 flex justify-center items-center rounded-lg', className)}
    >
      <Icon size={24} stroke={1.5} />
    </Button>
  );
};

interface Props {
  title?: string;
  showBackButton?: boolean;
  hideUserControls?: boolean;
  backRoute?: string;
}

export function CustomNavbar(props: Props) {
  const { showBackButton = false, hideUserControls, title, backRoute } = props;
  const { status, data } = useSession();
  const router = useRouter();

  const [showDeleteAccountModal, setShowModal] = useState(false);

  const { mutate: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => handleLogout(),
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleDeleteAccount = async () => {
    setShowModal(true);
  };

  if (status === 'unauthenticated') return <div style={{ height: '88px' }} />;
  if (!data) return <div style={{ height: '88px' }} />;
  if (!data.user) return <div style={{ height: '88px' }} />;

  const { user } = data as AuthenticatedSession;

  const isSubscriptionSetToCancel = user.hasSubscription && !!user.subscriptionCancelAt;

  return (
    <>
      <header className="h-16 flex justify-between items-center mb-6 z-10">
        <RenderIf condition={showBackButton}>
          <NavbarLink className="mr-4" icon={IconArrowLeft} onClick={() => backRoute ? router.push(backRoute) : router.back()}  />
        </RenderIf>
        <h1 className="text-4xl font-semibold">{title}</h1>
        <RenderIf condition={!hideUserControls}>
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
                <RenderIf condition={user?.role === ROLES.ADMIN}>
                  <DropdownMenuLabel>Management</DropdownMenuLabel>
                  <Link href="/users">
                    <DropdownMenuItem>
                      <IconUsers size={16} className="mr-2"/>
                      Manage Users
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                </RenderIf>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <RenderIf
                  condition={!!user?.hasSubscription}
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
                      Billing
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
      {isSubscriptionSetToCancel && user.subscriptionCancelAt ? (
        <div className="flex flex-row items-center justify-center h-[32px] mb-[86px] py-1 px-4 bg-amber-600 dark:bg-amber-500">
          <span className="text text-sm text-white">
            Your subscription is set to cancel on {formatDate(new Date(user.subscriptionCancelAt))}
          </span>
          <Button variant="undecorated" className="absolute top-0 right-0 bottom-0 h-[32px]">
            <IconX size={14}/>
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
