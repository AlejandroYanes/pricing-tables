import type { ReactNode } from 'react';

import ViewSizeGuard from 'components/ViewSizeGuard';

interface Props {
    children: ReactNode;
}

const PrivateLayout = (props: Props) => {
  return (
    <ViewSizeGuard>
      {props.children}
    </ViewSizeGuard>
  );
};

export default PrivateLayout;
