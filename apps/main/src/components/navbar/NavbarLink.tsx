import type { Icon as TablerIcon } from '@tabler/icons-react';
import { Button, cn } from '@dealo/ui';

interface Props {
  icon?: TablerIcon;
  label?: string;
  onClick?(): void;
  asSpan?: boolean;
  className?: string;
}

const NavbarLink = (props: Props) => {
  const { icon: Icon, label, onClick, asSpan, className } = props;
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

export default NavbarLink;
