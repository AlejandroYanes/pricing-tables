import { getServerSession } from 'next-auth';

import { authOptions } from 'utils/auth';
import ClientProviders from 'components/client-providers';

interface Props {
    children: any;
}

export default async function PublicLayout(props: Props) {
  const session = await getServerSession(authOptions);
  return (
    <ClientProviders session={session}>
      {props.children}
    </ClientProviders>
  );
}
