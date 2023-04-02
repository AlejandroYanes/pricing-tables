import type { JSXElementConstructor } from 'react';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import SignInAlert from 'components/SignInAlert';

export default function authGuard(Component: JSXElementConstructor<{ session: Session }>) {
  return () => {
    const { status, data } = useSession();

    if (status === 'loading') {
      return null;
    }

    if (status === 'unauthenticated') {
      return <SignInAlert asPage />;
    }

    return <Component session={data!} />;
  };
}
