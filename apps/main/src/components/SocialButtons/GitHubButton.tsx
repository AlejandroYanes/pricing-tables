import { IconBrandGithub } from '@tabler/icons-react';

import { Button, type ButtonProps } from '../ui/button';

export default function GithubButton(props: ButtonProps) {
  return (
    <Button {...props}>
      <IconBrandGithub size={16} className="mr-2" />
      Continue with GitHub
    </Button>
  );
}
