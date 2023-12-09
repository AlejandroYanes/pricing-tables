import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Stack, Title } from '@mantine/core';

import { GoogleButton } from 'components/SocialButtons';
import { GithubButton } from '../SocialButtons/GitHibButton';
import { DiscordButton } from '../SocialButtons/DiscordButton';

const SignInForm = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleSignIn = (provider: string) => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      return;
    }

    if (provider === 'credentials') {
      signIn('credentials', { callbackUrl: '/dashboard' }, { userName: 'guest' });
      return;
    }

    signIn(provider, { callbackUrl: '/dashboard' });
  }

  return (
    <Stack w={320}>
      <Title mx="auto" order={3}>Get started now.</Title>
      <GithubButton onClick={() => handleSignIn('github')} />
      <DiscordButton onClick={() => handleSignIn('discord')} />
      <GoogleButton onClick={() => handleSignIn('google')} />
    </Stack>
  );
};

export default SignInForm;
