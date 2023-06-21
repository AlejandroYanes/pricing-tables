'use client'

import { type ReactNode } from 'react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface Props {
  session: Session | null;
  children: ReactNode;
}

const ClientProvider = (props: Props) => {
  const { session, children } = props;

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default ClientProvider;
