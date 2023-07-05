import type { ReactNode } from 'react';
import { RenderIf } from '@dealo/ui';

import { CustomNavbar } from 'components/Navbar';
import { cn } from '../../utils/ui';

interface Props {
  hideNavbar?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  className?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, children, className, ...rest } = props;

  return (
    <section className={cn('flex flex-col relative pt-0 px-12 pb-6', className)}>
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
    </section>
  );
};

export default BaseLayout;
