import Link from 'next/link';

import BaseLayout from 'components/base-layout';
import { NavbarLink } from 'components/navbar';

export default function MdxLayout({ children }: { children: any }) {
  return (
    <BaseLayout hideNavbar footerClassName="w-full max-w-[1200px] mx-auto">
      <header className="h-16 flex gap-2 justify-end items-center mb-6 z-10 px-4 md:px-0 w-full max-w-[1200px] mx-auto">
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
      {children}
    </BaseLayout>
  );
}
