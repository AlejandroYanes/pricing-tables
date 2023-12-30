import type { ReactNode } from 'react';
import Link from 'next/link';
import { RenderIf, cn } from '@dealo/ui';

import { CustomNavbar } from 'components/Navbar';

interface Props {
  hideNavbar?: boolean;
  hideFooter?: boolean;
  hideUserControls?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  className?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, hideFooter, children, className, ...rest } = props;

  return (
    <section className={cn('flex flex-col relative pt-0 px-12 pb-6', className)}>
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar {...rest} />
      </RenderIf>
      {children}
      <div className={classes.spacer} />
      <RenderIf condition={!hideFooter}>
        <footer className={classes.footer}>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </footer>
      </RenderIf>
    </section>
  );
};

export default BaseLayout;
