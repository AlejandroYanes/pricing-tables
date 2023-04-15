import { signIn } from 'next-auth/react';
import { Stack, Title } from '@mantine/core';

import { GoogleButton } from 'components/SocialButtons';
import { GithubButton } from '../SocialButtons/GitHibButton';
import { DiscordButton } from '../SocialButtons/DiscordButton';

const SignInForm = () => {
  return (
    <Stack w={400} mx="auto">
      <Title mx="auto" order={3}>Get started now.</Title>
      <GithubButton onClick={() => signIn('github', { callbackUrl: '/dashboard' })} />
      <DiscordButton onClick={() => signIn('discord', { callbackUrl: '/dashboard' })} />
      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/dashboard' })} />
    </Stack>
  );
};

export default SignInForm;
