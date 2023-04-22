import { signIn } from 'next-auth/react';
import { Button, Divider, Stack, Text, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

import { GoogleButton } from 'components/SocialButtons';
import { GithubButton } from '../SocialButtons/GitHibButton';
import { DiscordButton } from '../SocialButtons/DiscordButton';

const SignInForm = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack w={320}>
      <Title mx="auto" order={3}>Get started now.</Title>
      <GithubButton onClick={() => signIn('github', { callbackUrl: '/dashboard' })} />
      <DiscordButton onClick={() => signIn('discord', { callbackUrl: '/dashboard' })} />
      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/dashboard' })} />
      <Divider my="md" label="OR" labelPosition="center" />
      <Button
        variant="outline"
        color={colorScheme === 'dark' ? 'gray' : 'dark'}
        onClick={() => signIn('credentials', { callbackUrl: '/dashboard' }, { userName: 'guest' })}
      >
        Try as a Guest
      </Button>
      <Text size="sm">
        When trying as a <strong>Guest</strong> anything you create will be deleted in 5 days.
        This is done to prevent abuse of the service. Also, when signing out you will lose access to all you may have created.
      </Text>
    </Stack>
  );
};

export default SignInForm;
