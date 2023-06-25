'use client'

// import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import type { AsyncComponent, SimpleComponent } from '@dealo/helpers';

import SetupModal from 'components/SetupModal';
// import { authOptions } from '../../app/api/auth/[...nextauth]/route';

type WrappedComponent = SimpleComponent<{ session: Session }> | AsyncComponent<{ session: Session }>;

export default function authGuard(Component: WrappedComponent) {
  return async () => {
    // const session = await getServerSession(authOptions);
    const { status, data: session } = useSession();
    const router = useRouter();

    if (status === 'loading') {
      return null;
    }

    if (!session?.user) {
      router.push('/');
      return null;
    }

    const ProxyComponent = Component as any;

    if (!session.user.isSetup) {
      return (
        <>
          <SetupModal />
          <ProxyComponent session={session} />
        </>
      );
    }

    return <ProxyComponent session={session} />;
  };
}
