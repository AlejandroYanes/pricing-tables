import type { ReactNode } from 'react';

import AuthGuard from 'components/AuthGuard';

interface Props {
    children: ReactNode;
}

const PrivateLayout = (props: Props) => {
  return (
    <AuthGuard>
      {props.children}
    </AuthGuard>
  );
};

export default PrivateLayout;
