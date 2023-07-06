import { IconBrandGithub } from '@tabler/icons-react';

import { Button, type ButtonProps } from '../ui/button';
import { cn } from '../../utils/ui';

export default function GithubButton(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button className={cn('bg-primary text-primary-foreground hover:bg-primary/90', className)} {...rest}>
      <IconBrandGithub size={16} className="mr-2" />
      Continue with GitHub
    </Button>
  );
}
