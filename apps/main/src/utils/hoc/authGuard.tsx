'use client'

import type { JSXElementConstructor } from 'react';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import SetupModal from 'components/SetupModal';

export default function authGuard(Component: JSXElementConstructor<{ session: Session }>) {
  return async () => {
    const session = await getServerSession();
    // const { status, data } = useSession();
    const router = useRouter();
    //
    // if (status === 'loading') {
    //   return null;
    // }

    if (!session?.user) {
      router.push('/');
      return null;
    }

    if (!session.user.isSetup) {
      return (
        <>
          <SetupModal />
          <Component session={session} />
        </>
      );
    }

    return <Component session={session} />;
  };
}
