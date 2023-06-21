'use client'

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { GoogleButton, GitHubButton, DiscordButton } from 'components/SocialButtons';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const SignInForm = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleSignIn = (provider: string) => {
    if (status === 'authenticated') {
      router.push('/d/dashboard');
      return;
    }

    if (provider === 'credentials') {
      signIn('credentials', { callbackUrl: '/d/dashboard' }, { userName: 'guest' });
      return;
    }

    signIn(provider, { callbackUrl: '/d/dashboard' });
  }

  return (
    <div className="w-[320px] flex flex-col gap-4">
      <h3 className="text-center">Get started now.</h3>
      <GitHubButton onClick={() => handleSignIn('github')} />
      <DiscordButton onClick={() => handleSignIn('discord')} />
      <GoogleButton onClick={() => handleSignIn('google')} />
      <div className="flex items-center gap-2">
        <Separator />
        <span className="text-sm">OR</span>
        <Separator />
      </div>
      <Button variant="outline" onClick={() => handleSignIn('credentials')}>
        Try as a Guest
      </Button>
      <span className="text-gray-500 text-sm">
        When trying as a <strong>Guest</strong> anything you create will be deleted in 5 days.
        This is done to prevent abuse of the service. Also, when signing out you will lose access to all you may have created.
      </span>
    </div>
  );
};

export default SignInForm;
