import { GoogleIcon } from './GoogleIcon';
import { Button, type ButtonProps } from '../ui/button';

export default function GoogleButton(props: ButtonProps) {
  return (
    <Button variant="outline" {...props}>
      <GoogleIcon className="mr-2" />
      Continue with Google
    </Button>
  );
}

