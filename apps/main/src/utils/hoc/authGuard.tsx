import type { JSXElementConstructor } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';

import SetupModal from 'components/SetupModal';

export default function authGuard(Component: JSXElementConstructor<{ session: Session }>) {
  return () => {
    const { status, data } = useSession();
    const router = useRouter();

    if (status === 'loading') {
      return null;
    }

    if (status === 'unauthenticated' || !data?.user) {
      router.push('/');
      return null;
    }

    if (!data.user.isSetup) {
      return (
        <>
          <SetupModal />
          <Component session={data!} />
        </>
      );
    }

    return <Component session={data!} />;
  };
}
