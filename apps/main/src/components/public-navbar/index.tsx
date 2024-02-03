import Link from 'next/link';
import { RenderIf } from '@dealo/ui';

import { NavbarLink } from '../navbar';

interface Props {
  showHome?: boolean;
}

export default function PublicNavbar(props: Props) {
  const { showHome } = props;
  return (
    <header className="h-16 flex gap-2 justify-end items-center mb-6 z-10 px-4 md:px-0 w-full max-w-[1200px] mx-auto">
      <RenderIf condition={!!showHome}>
        <Link href="/">
          <NavbarLink label="Home"/>
        </Link>
      </RenderIf>
      <Link href="/pricing">
        <NavbarLink label="Pricing"/>
      </Link>
      <Link href="/#faq-section">
        <NavbarLink label="FAQ"/>
      </Link>
      <Link href="/blog">
        <NavbarLink label="Blog"/>
      </Link>
      <Link href="/contact/query">
        <NavbarLink label="Contact Us"/>
      </Link>
      <Link href="/signin">
        <NavbarLink label="Sign in"/>
      </Link>
    </header>
  );
}
