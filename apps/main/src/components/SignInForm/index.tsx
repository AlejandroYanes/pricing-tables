import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Stack, Title } from '@mantine/core';
import { generateQueryString } from 'helpers';

import { GoogleButton, GithubButton, DiscordButton } from 'components/SocialButtons';

const SignInForm = () => {
  const { status } = useSession();
  const { query, ...router } = useRouter();

  const buildCheckoutUrl = () => {
    const checkoutPageRoute = '/stripe/checkout/start';
    const searchParams = generateQueryString(query);
    return `${checkoutPageRoute}?${searchParams}}`;
  }

  const handleSignIn = (provider: string) => {
    if (status === 'authenticated') {
      if (query.internal_flow === 'true') {
        router.push(buildCheckoutUrl());
      } else {
        router.push('/dashboard');
      }
      return;
    }

    if (query.internal_flow === 'true') {
      const checkoutUrl = buildCheckoutUrl();
      signIn(provider, { callbackUrl: checkoutUrl });
    } else {
      signIn(provider, { callbackUrl: '/dashboard' });
    }
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
