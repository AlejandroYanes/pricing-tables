'use client'
import { useState } from 'react';
import Link from 'next/link';
import {
  RenderIf,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
} from '@dealo/ui';
import { IconMenu } from '@tabler/icons-react';

import { useMediaQuery } from 'utils/hooks/use-media-query';
import { NavbarLink } from '../navbar';

interface Props {
  showHome?: boolean;
}

function DesktopNavbar(props: Props) {
  const { showHome } = props;

  return (
    <header className="h-16 flex gap-2 justify-end items-center mb-6 z-10 px-4 xl:px-0 w-full max-w-[1200px] mx-auto">
      <RenderIf condition={!!showHome}>
        <Link href="/">
          <NavbarLink label="Home"/>
        </Link>
      </RenderIf>
      <Link href="/#pricing-section">
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

function MobileNavbar(props: Props) {
  const { showHome } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer direction="top" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="undecorated"
          className="w-12 h-12 p-0 flex flex-row justify-center items-center ml-auto"
          onClick={() => setIsOpen(true)}
        >
          <IconMenu />
        </Button>
      </DrawerTrigger>
      <DrawerContent direction="top">
        <DrawerHeader>
          <DrawerTitle>Where do you want to go?</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 mb-5">
          <RenderIf condition={!!showHome}>
            <Link href="/" className="text-center py-2">
              Home
            </Link>
          </RenderIf>
          <Link href="/#pricing-section" className="text-center py-2" onClick={() => setIsOpen(false)}>
            Pricing
          </Link>
          <Link href="/#faq-section" className="text-center py-2" onClick={() => setIsOpen(false)}>
            FAQ
          </Link>
          <Link href="/blog" className="text-center py-2">
            Blog
          </Link>
          <Link href="/contact/query" className="text-center py-2">
            Contact Us
          </Link>
          <Link href="/signin" className="text-center py-2">
            Sign in
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default function PublicNavbar(props: Props) {
  const isMobile = useMediaQuery('(max-width: 500px)');

  if (isMobile) return <MobileNavbar {...props} />;

  return <DesktopNavbar {...props} />;
}
