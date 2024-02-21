import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from 'utils/auth';
import ViewSizeGuard from 'components/view-size-guard';
import ClientProviders from 'components/client-providers';

interface Props {
  children: any;
}

export default async function FirstTimeLayout(props: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  return (
    <ViewSizeGuard>
      <ClientProviders session={session}>
        {props.children}
      </ClientProviders>
    </ViewSizeGuard>
  );
}
