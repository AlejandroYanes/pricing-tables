'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type Icon as TablerIcon, IconArrowLeft } from '@tabler/icons-react';
import { Button, cn, RenderIf } from '@dealo/ui';

interface NavbarLinkProps {
  icon?: TablerIcon;
  label?: string;
  onClick?(): void;
  asSpan?: boolean;
  className?: string;
}

const NavbarLink = ({ icon: Icon, label, onClick, asSpan, className }: NavbarLinkProps) => {
  if (asSpan) {
    return (
      <Button
        onClick={onClick}
        component="span"
        variant="ghost"
        className={cn('flex justify-center items-center rounded-lg', className)}
      >
        {Icon ? <Icon size={24} stroke={1.5} /> : null}
        {label}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn('flex justify-center items-center rounded-lg', className)}
    >
      {Icon ? <Icon size={24} stroke={1.5} /> : null}
      {label}
    </Button>
  );
};

interface Props {
  showBackButton?: boolean;
  backRoute?: string;
}

export default function PublicNavbar(props: Props) {
  const { showBackButton = false, backRoute } = props;
  const router = useRouter();

  return (
    <header className="flex flex-row justify-start items-center border-0 h-[64px] mb-6 z-10">
      <RenderIf condition={showBackButton}>
        <NavbarLink className="mr-4" icon={IconArrowLeft} onClick={() => backRoute ? router.push(backRoute) : router.back()}  />
      </RenderIf>
      <div className="flex gap-2 ml-auto">
        <Link href="/pricing">
          <NavbarLink label="Pricing" />
        </Link>
        <Link href="/signin">
          <NavbarLink label="Sign in"  />
        </Link>
      </div>
    </header>
  );
}
