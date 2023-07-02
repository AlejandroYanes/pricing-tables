'use client'

import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';

import BaseLayout from '../BaseLayout';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
}

const query = '(max-width: 586px)'; // TODO: change to 1280px when ready

const ViewSizeGuard = (props: Props) => {
  const router = useRouter();
  const matches = useMediaQuery(query);

  console.log('matches', matches);

  if (matches) {
    return (
      <BaseLayout hideNavbar>
        <div className="flex flex-col items-center justify-center mx-auto mt-16 max-w-[600px]">
          <Image src="/illustrations/mobile_devices.svg" width={320} height={280} alt="no mobile support" />
          <h2 className="text text-4xl font-semibold align-center my-6">
            No small screen support.
          </h2>
          <span className="text align-center mb-5">
              We currently do not support small screens, we are working on it.
            <br />
              Please use a desktop device to access the app.
          </span>
          <Button variant="outline" onClick={() => router.push('/')}>Go back</Button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <>
      {props.children}
    </>
  );
};

export default ViewSizeGuard;