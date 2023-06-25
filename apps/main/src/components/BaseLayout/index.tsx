import type { ReactNode } from 'react';
import { RenderIf } from 'ui';

import { CustomNavbar } from 'components/Navbar';

interface Props {
  hideNavbar?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, children, ...rest } = props;

  return (
    <section className="flex flex-col relative pt-0 px-12 pb-6">
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
    </section>
  );
};

export default BaseLayout;
