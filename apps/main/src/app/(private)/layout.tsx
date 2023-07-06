import type { ReactNode } from 'react';

import AuthGuard from 'components/AuthGuard';
import { Toaster } from 'components/ui/toaster';

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
