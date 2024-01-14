import { Button, type ButtonProps } from '@dealo/ui';

import { GoogleIcon } from './GoogleIcon';

export default function GoogleButton(props: ButtonProps) {
  return (
    <Button variant="outline" {...props}>
      <GoogleIcon className="mr-2" />
      Continue with Google
    </Button>
  );
}

