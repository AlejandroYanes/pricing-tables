import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Divider, Stack, Text, Title } from '@mantine/core';

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
      {/* TODO: to be deleted once the guess user is safely not in use */}
      {/*<Divider my="md" label="OR" labelPosition="center" />*/}
      {/*<Button variant="default" onClick={() => handleSignIn('credentials')}>*/}
      {/*  Try as a Guest*/}
      {/*</Button>*/}
      {/*<Text size="sm">*/}
      {/*  When trying as a <strong>Guest</strong> anything you create will be deleted in 5 days.*/}
      {/*  This is done to prevent abuse of the service. Also, when signing out you will lose access to all you may have created.*/}
      {/*</Text>*/}
    </Stack>
  );
};

export default SignInForm;
