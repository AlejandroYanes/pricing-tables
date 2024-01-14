import type { ReactNode } from 'react';
import { Toaster } from '@dealo/ui';

import AuthGuard from 'components/AuthGuard';

interface Props {
    children: ReactNode;
}

const PrivateLayout = (props: Props) => {
  return (
    <AuthGuard>
      {props.children}
      <Toaster />
    </AuthGuard>
  );
};

export default PrivateLayout;
