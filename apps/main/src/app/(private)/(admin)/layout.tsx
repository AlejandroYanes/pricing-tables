import { Toaster } from '@dealo/ui';

import AuthGuard from 'components/auth-guard';

interface Props {
    children: any;
}

const AdminsLayout = (props: Props) => {
  return (
    <AuthGuard isAdmin>
      <>{props.children}</>
      <Toaster />
    </AuthGuard>
  );
};

export default AdminsLayout;
