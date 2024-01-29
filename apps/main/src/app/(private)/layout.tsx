import { getServerSession } from 'next-auth';
import { Toaster } from '@dealo/ui';

import { authOptions } from 'utils/auth';
import AuthGuard from 'components/auth-guard';
import ClientProviders from 'components/client-providers';

interface Props {
    children: any;
}

const PrivateLayout = async (props: Props) => {
  const session = await getServerSession(authOptions);
  return (
    <AuthGuard session={session}>
      <ClientProviders session={session}>
        {props.children}
      </ClientProviders>
      <Toaster />
    </AuthGuard>
  );
};

export default PrivateLayout;
