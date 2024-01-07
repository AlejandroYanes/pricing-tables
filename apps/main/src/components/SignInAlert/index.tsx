import Head from 'next/head';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, AlertTitle, AlertDescription, Button } from '@dealo/ui';

import BaseLayout from '../BaseLayout';

interface Props {
  asPage?: boolean;
}

export default function SignInAlert(props: Props) {
  const { asPage } = props;

  if (asPage) {
    return (
      <>
        <Head>
          <title>Dealo | Oops...</title>
        </Head>
        <BaseLayout hideNavbar>
          <div className="flex flex-col mx-auto mt-[120px] max-w-[700px]">
            <Alert>
              <IconAlertCircle size={16} />
              <AlertTitle>Hmm....</AlertTitle>
              <AlertDescription>
                {`Seems we're not sure who you are, do you mind signing in?`}
                <div className="flex justify-end mt-4">
                  <Link href="/"><Button>Sign in</Button></Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </BaseLayout>
      </>
    );
  }

  return (
    <Alert>
      <IconAlertCircle size={16} />
      <AlertTitle>Hmm...</AlertTitle>
      <AlertDescription>
        {`Seems we're not sure who you are, do you mind signing in?`}
        <div className="flex justify-end mt-4">
          <Link href="/"><Button>Sign in</Button></Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}
