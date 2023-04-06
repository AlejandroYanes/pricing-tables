import type { JSXElementConstructor } from 'react';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import SignInAlert from 'components/SignInAlert';
import SetupModal from 'components/SetupModal';

export default function authGuard(Component: JSXElementConstructor<{ session: Session }>) {
  return () => {
    const { status, data } = useSession();

    if (status === 'loading') {
      return null;
    }

    if (status === 'unauthenticated') {
      return <SignInAlert asPage />;
    }

    if (!data?.user) {
      return <SignInAlert asPage />;
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
