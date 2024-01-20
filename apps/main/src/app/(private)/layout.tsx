import { Toaster } from '@dealo/ui';

import AuthGuard from 'components/AuthGuard';

interface Props {
    children: any;
}

const PrivateLayout = (props: Props) => {
  return (
    <AuthGuard>
      <>{props.children}</>
      <Toaster />
    </AuthGuard>
  );
};

export default PrivateLayout;
