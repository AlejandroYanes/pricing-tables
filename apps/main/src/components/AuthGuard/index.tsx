'use client'

import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROLES } from '@dealo/models';

import SetupModal from '../SetupModal';

interface Props {
  isAdmin?: boolean;
  children: ReactNode;
}

const AuthGuard = (props: Props) => {
  const { isAdmin, children } = props;
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return null;
  }

  if (!session?.user) {
    router.push('/');
    return null;
  }

  if (isAdmin && session.user.role !== ROLES.ADMIN) {
    router.push('/dashboard');
    return null;
  }

  if (!session.user.isSetup) {
    return (
      <>
        <SetupModal />
        {children}
      </>
    );
  }

  return (
    <>
      {children}
    </>
  )
};

export default AuthGuard;
