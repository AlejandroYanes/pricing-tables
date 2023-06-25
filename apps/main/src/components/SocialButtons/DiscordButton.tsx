import { IconBrandDiscord } from '@tabler/icons-react';

import { Button, type ButtonProps } from '../ui/button';

export default function DiscordButton(props: ButtonProps) {
  return (
    <Button {...props} className="bg-violet-600 text-white hover:bg-violet-600/90">
      <IconBrandDiscord size={16} className="mr-2" />
      Continue with Discord
    </Button>
  );
}
