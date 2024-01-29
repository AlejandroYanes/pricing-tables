/* eslint-disable max-len */
import Link from 'next/link';
import { IconBug, IconHelp } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';
import { NavbarLink } from 'components/Navbar';
import Card from './Card';

interface Props {
  children?: any;
}

export default function ContactPageLayout(props: Props) {
  const { children } = props;

  return (
    <BaseLayout
      hideNavbar
      className="px-4 md:px-12"
      footerClassName="w-full max-w-[1200px] mx-auto"
    >
      <header className="h-16 flex gap-2 justify-end items-center mb-6 z-10 px-4 md:px-0 w-full max-w-[1200px] mx-auto">
        <Link href="/">
          <NavbarLink label="Home"/>
        </Link>
        <Link href="/pricing">
          <NavbarLink label="Pricing"/>
        </Link>
        <Link href="/#faq-section">
          <NavbarLink label="FAQ"/>
        </Link>
        <Link href="/contact/query">
          <NavbarLink label="Contact Us"/>
        </Link>
        <Link href="/signin">
          <NavbarLink label="Sign in"/>
        </Link>
      </header>
      <main className="flex flex-col md:flex-row justify-center gap-14 mx-auto mt-10 md:max-w-[980px]">
        <aside className="flex flex-col gap-10">
          <h1 className="text-4xl text-left mb-4">Get in touch</h1>
          <Card
            to="/contact/query"
            title="Send a query"
            text="Ask any questions you have"
            icon={<IconHelp/>}
          />
          <Card
            to="/contact/report"
            title="Open a support ticket"
            text="Troubleshoot a technical issue or payment problem."
            icon={<IconBug/>}
          />
        </aside>
        {children}
      </main>
    </BaseLayout>
  );
}
