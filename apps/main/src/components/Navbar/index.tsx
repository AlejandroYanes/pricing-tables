'use client'

import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import type { TablerIcon } from '@tabler/icons';
import { IconArrowLeft, IconInfoCircle, IconLogout, IconSettings, IconTrash, IconUser, IconUsers } from '@tabler/icons';
import { RenderIf } from 'ui';
import { ROLES } from 'models';
import { useState } from 'react';

import { trpc } from 'utils/trpc';
import { Button } from 'components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from 'components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface NavbarLinkProps {
	icon: TablerIcon;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, onClick }: NavbarLinkProps) {
  return (
    <Button onClick={onClick} className="h-[50px] w-[50px] flex justify-center items-center rounded">
      <Icon stroke={1.5} />
    </Button>
  );
}

interface Props {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
}

export function CustomNavbar(props: Props) {
  const { showBackButton = false, title, backRoute } = props;
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

  const { user } = data;

  return (
    <>
      <header className="h-16 flex justify-between items-center mb-5 z-10">
        <RenderIf condition={showBackButton}>
          <NavbarLink icon={IconArrowLeft} onClick={() => backRoute ? router.push(backRoute) : router.back()}  />
        </RenderIf>
        <h1 className="text-4xl">{title}</h1>
        <div className="flex items-center gap-4 ml-auto">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div>
                <NavbarLink icon={IconInfoCircle} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-[200px]">
              <p className="text text-black">
                This platform is still an alpha version, so if you find any bugs or have any suggestions,
                please let me know at <a href="mailto:alejandro@dealo.app">alejandro@dealo.app</a>!
              </p>
            </HoverCardContent>
          </HoverCard>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <NavbarLink icon={IconUser} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] mt-6">
              <RenderIf condition={user?.role === ROLES.ADMIN}>
                <DropdownMenuLabel>Management</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/users')}>
                  <IconUsers size={14} />
                  Manage Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/guests')}>
                  <IconUsers size={14} />
                  Manage Guests
                </DropdownMenuItem>
                DropdownMenuSeparator
              </RenderIf>
              <DropdownMenuLabel>{user?.role !== ROLES.GUEST ?  user?.name : 'Guest'}</DropdownMenuLabel>
              <RenderIf condition={user?.role !== ROLES.GUEST}>
                <DropdownMenuItem><IconSettings size={14} />Settings</DropdownMenuItem>
              </RenderIf>
              <DropdownMenuItem onClick={handleLogout}><IconLogout size={14} />Logout</DropdownMenuItem>
              <RenderIf condition={user?.role !== ROLES.GUEST}>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
                <DropdownMenuItem color="destructive" onClick={handleDeleteAccount}>
                  <IconTrash size={14} />
                  Delete my account
                </DropdownMenuItem>
              </RenderIf>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <RenderIf condition={showDeleteAccountModal}>
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your account?
                We promise we {`won't`} keep any data about you but you will also loose everything {`you've`} created with us,
                and this action is irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowModal(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteAccount()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </RenderIf>
    </>
  );
}
