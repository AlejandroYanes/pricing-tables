import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { ROLES } from '@dealo/models';

interface Props {
  isAdmin?: boolean;
  session: Session | null;
  children: any;
}

const AuthGuard = (props: Props) => {
  const { isAdmin, session, children } = props;

  if (!session?.user) {
    redirect('/');
  }

  if (isAdmin && session.user.role !== ROLES.ADMIN) {
    redirect('/dashboard');
  }

  if (!session.user.isSetup) {
    redirect('/first-time');
  }

  return (
    <>
      {children}
    </>
  )
};

export default AuthGuard;
