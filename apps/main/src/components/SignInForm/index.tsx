'use client'
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { generateQueryString } from '@dealo/helpers';

import GithubButton from './GitHubButton';
import DiscordButton from './DiscordButton';
import GoogleButton from './GoogleButton';

interface Props {
  searchParams: Record<string, string | null>;
  session: Session | null;
}

const SignInForm = (props: Props) => {
  const { searchParams, session } = props;
  const router = useRouter();

  const buildCheckoutUrl = () => {
    const checkoutPageRoute = '/stripe/checkout/start';
    const queryParams = generateQueryString(searchParams);
    return `${checkoutPageRoute}?${queryParams}`;
  }

  const handleSignIn = (provider: string) => {
    if (!!session) {
      if (searchParams.internal_flow === 'true') {
        router.push(buildCheckoutUrl());
      } else {
        router.push('/dashboard');
      }
      return;
    }

    if (searchParams.internal_flow === 'true') {
      const checkoutUrl = buildCheckoutUrl();
      signIn(provider, { callbackUrl: checkoutUrl });
    } else {
      signIn(provider, { callbackUrl: '/dashboard' });
    }
  }

  return (
    <div className="w-[320px] flex flex-col gap-4">
      <h3 className="text-center">Get started now.</h3>
      <GithubButton onClick={() => handleSignIn('github')} />
      <DiscordButton onClick={() => handleSignIn('discord')} />
      <GoogleButton onClick={() => handleSignIn('google')} />
    </div>
  );
};

export default SignInForm;
