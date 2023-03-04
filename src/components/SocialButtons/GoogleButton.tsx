import type { ButtonProps } from '@mantine/core';
import { Button } from '@mantine/core';

import { GoogleIcon } from './GoogleIcon';

export default function GoogleButton(props: ButtonProps & { onClick: () => void }) {
  return (
    <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props}>
      Continue with Google
    </Button>
  );
}

