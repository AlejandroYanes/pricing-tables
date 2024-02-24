'use client'
import { useState } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  IconDeviceDesktop, IconFlask,
  IconLogout,
  IconMoon, IconPaint,
  IconReceipt,
  IconSun,
  IconTrash,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  RenderIf,
  useToast,
} from '@dealo/ui';
import { ROLES } from '@dealo/models';
import { formatStripeDate } from '@dealo/helpers';

import { trpc } from 'utils/trpc';
import NavbarLink from './NavbarLink';

interface Props {
  user: Session['user'];
  hasSubscription: boolean;
}

const resolveStatusLabel = (user: Session['user']) => {
  if (user?.role === ROLES.ADMIN) {
    return 'Admin';
  }

  switch (user?.subscriptionStatus) {
    case 'active':
      return 'Paid';
    case 'trialing':
      return `Free Trial until ${formatStripeDate(user!.trialEnd!)}`;
    case 'paused':
      return 'Paused';
    default:
      return 'Free';
  }
};

export default function UserMenu(props: Props) {
  const { hasSubscription, user } = props;

  const { theme, setTheme } = useTheme();

  const { toast } = useToast();

  const [showDeleteAccountModal, setShowModal] = useState(false);

  const { mutate: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => handleLogout(),
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleDeleteAccount = async () => {
    setShowModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <NavbarLink asSpan icon={IconUser}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] mt-3">
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs font-light">
            {resolveStatusLabel(user)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <RenderIf condition={user?.role === ROLES.ADMIN}>
            <DropdownMenuLabel>Management</DropdownMenuLabel>
            <Link href="/users">
              <DropdownMenuItem>
                <IconUsers size={16} className="mr-2"/>
                Manage Users
              </DropdownMenuItem>
            </Link>
            <Link href="/experiments">
              <DropdownMenuItem>
                <IconFlask size={16} className="mr-2"/>
                Experiments
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </RenderIf>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconPaint size={16} className="mr-2" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={() => setTheme('system')}>
                  <IconDeviceDesktop size={16} className="mr-2" />
                  <span>System</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={() => setTheme('light')}>
                  <IconSun size={16} className="mr-2" />
                  <span>Light</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={() => setTheme('dark')}>
                  <IconMoon size={16} className="mr-2" />
                  <span>Dark</span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <RenderIf
            condition={hasSubscription}
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
      <RenderIf condition={showDeleteAccountModal}>
        <AlertDialog open>
          <AlertDialogContent className="md:min-w-[700px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="pb-8">
                We will disconnect your Stripe account from our platform and delete all information regarding your widgets.
                <br/>
                <br/>
                We will not however delete your personal information (eg: name and email) from our database,
                this is to prevent abuse of our free trial or refund policy.
                <br/>
                Your information will not be used for any other purpose.
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
