import { getServerSession } from 'next-auth';
import { Toaster } from '@dealo/ui';

import AuthGuard from 'components/auth-guard';
import { authOptions } from 'utils/auth';

interface Props {
  children: any;
}

export default async function AdminsLayout(props: Props) {
  const session = await getServerSession(authOptions);
  return (
    <AuthGuard session={session} isAdmin>
      <>{props.children}</>
      <Toaster />
    </AuthGuard>
  );
}
