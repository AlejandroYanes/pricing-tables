import type { ReactNode } from 'react';
import Link from 'next/link';
import { RenderIf, cn, Button } from '@dealo/ui';

import { CustomNavbar } from 'components/Navbar';

interface Props {
  hideNavbar?: boolean;
  hideFooter?: boolean;
  hideLinks?: boolean;
  hideUserControls?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  className?: string;
  navBarClassName?: string;
  children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, hideFooter, children, className, navBarClassName, ...rest } = props;

  return (
    <section className={cn('flex flex-col relative pt-0 px-4 md:px-12 pb-6 min-h-screen', className)}>
      <RenderIf condition={!hideNavbar}>
        <CustomNavbar className={navBarClassName} {...rest} />
      </RenderIf>
      {children}
      <div className="mt-auto" />
      <RenderIf condition={!hideFooter}>
        <footer className="flex flex-row items-center justify-end mt-[64px] h-[32px] bg-background">
          <Link href="/privacy-policy">
            <Button variant="ghost">
              Privacy Policy
            </Button>
          </Link>
        </footer>
      </RenderIf>
    </section>
  );
};

export default BaseLayout;
