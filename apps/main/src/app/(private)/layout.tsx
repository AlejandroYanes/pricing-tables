import { getServerSession } from 'next-auth';
import { Toaster } from '@dealo/ui';

import { authOptions } from 'utils/auth';
import AuthGuard from 'components/AuthGuard';
import ClientProviders from 'components/ClientProviders';

interface Props {
    children: any;
}

const PrivateLayout = async (props: Props) => {
  const session = await getServerSession(authOptions);
  return (
    <AuthGuard>
      <ClientProviders session={session}>
        {props.children}
      </ClientProviders>
      <Toaster />
    </AuthGuard>
  );
};

export default PrivateLayout;
