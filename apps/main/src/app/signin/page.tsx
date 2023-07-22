/* eslint-disable max-len */

import Link from 'next/link';
import Head from 'next/head';
import { IconAlertCircle } from '@tabler/icons-react';
import { RenderIf, Alert, AlertDescription, AlertTitle, Button } from '@dealo/ui';
import Image from 'next/image';

import BaseLayout from 'components/BaseLayout';
import SignInForm from 'components/SignInForm';

const errorsMap: { [error: string]: string } = {
  fallback: "Seems something went wrong but we can't point to what, please contact the developers and send the url you have right now.",
  OAuthAccountNotLinked: 'Seems you already have an account with that email but with another provider.'
};

interface Props {
  searchParams: {
    callbackUrl?: string;
    error?: string;
  };
}

export default function SigninPage(props: Props) {
  const { searchParams: query } = props;
  const hasErrors = !!query.error;
  const errorMessage = errorsMap[query.error as string] || errorsMap.fallback;

  return (
    <>
      <Head>
        <title>Dealo</title>
      </Head>
      <BaseLayout>
        <RenderIf
          fallback={
            <div className="flex flex-col gap-8 mx-auto items-center">
              <div className="flex items-center gap-0">
                <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
                <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
              </div>
              <h2 className="text-[40px] leading-[1.2] font-bold">
                A platform to streamline <br />
                <span className="relative py-1 px-3 bg-emerald-500/[.15]">pricing cards</span>
                <br />
                into your website.
              </h2>
              <span className="mt-4 text-gray-500">
                Build fully functional pricing widgets in minutes using our set of templates.
              </span>
              <SignInForm />
            </div>
          }
          condition={hasErrors}
        >
          <div className="flex flex-col gap-8 max-w-[700px] mt-16 mx-auto mb-0">
            <Alert>
              <IconAlertCircle size={16} />
              <AlertTitle>Hm...</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="flex justify-end items-end mt-4">
              <Link href="/">
                <Button variant="outline">Get back</Button>
              </Link>
            </div>
          </div>
        </RenderIf>
      </BaseLayout>
    </>
  );
}
