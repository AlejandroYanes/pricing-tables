'use client'
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { ROLES } from '@dealo/models';

import SetupModal from '../setup-modal';

interface Props {
  isAdmin?: boolean;
  session: Session | null;
  children: any;
}

const AuthGuard = (props: Props) => {
  const { isAdmin, session, children } = props;
  const router = useRouter();

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
