import type { ReactNode } from 'react';
import { Toaster } from '@dealo/ui';

import AuthGuard from 'components/AuthGuard';

interface Props {
    children: ReactNode;
}

const AdminsLayout = (props: Props) => {
  return (
    <AuthGuard isAdmin>
      {props.children}
      <Toaster />
    </AuthGuard>
  );
};

export default AdminsLayout;
