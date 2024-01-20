import Link from 'next/link';
import { RenderIf, cn, Button } from '@dealo/ui';

import Navbar from 'components/Navbar';

interface Props {
  hideNavbar?: boolean;
  hideFooter?: boolean;
  hideUserControls?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  title?: string;
  className?: string;
  navBarClassName?: string;
  footerClassName?: string;
  children: any;
}

const BaseLayout = (props: Props) => {
  const { hideNavbar = false, hideFooter, children, className, navBarClassName, footerClassName, ...rest } = props;

  return (
    <section className={cn('flex flex-col relative pt-0 px-12 pb-6 min-h-screen', className)}>
      <RenderIf condition={!hideNavbar}>
        <Navbar className={navBarClassName} {...rest} />
      </RenderIf>
      {children}
      <div className="mt-auto" />
      <RenderIf condition={!hideFooter}>
        <footer className={cn('flex flex-row items-center justify-end mt-[64px] h-[32px] bg-background', footerClassName)}>
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
