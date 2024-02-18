'use client';
import { signIn } from 'next-auth/react';
import { IconBrandDiscordFilled, IconBrandGithubFilled } from '@tabler/icons-react';
import { Button } from '@dealo/ui';

import { GoogleIcon } from './GoogleIcon';

const SignInForm = () => {

  const handleSignIn = (provider: string) => {
    return signIn(provider, { redirect: false });
  };

  return (
    <div className="w-[320px] flex flex-col gap-4">
      <h3 className="text-center">Get started now.</h3>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleSignIn('github')}>
        <IconBrandGithubFilled size={16} className="mr-2" />
        Continue with GitHub
      </Button>
      <Button className="bg-violet-600 text-white hover:bg-violet-600/90" onClick={() => handleSignIn('discord')}>
        <IconBrandDiscordFilled size={16} className="mr-2" />
        Continue with Discord
      </Button>
      <Button variant="outline" onClick={() => handleSignIn('google')}>
        <GoogleIcon className="mr-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default SignInForm;
