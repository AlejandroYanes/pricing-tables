'use client'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@dealo/ui';

import { useMediaQuery } from 'utils/hooks/useMediaQuery';
import BaseLayout from '../BaseLayout';

interface Props {
  children: any;
}

const query = '(max-width: 1280px)';

const ViewSizeGuard = (props: Props) => {
  const router = useRouter();
  const matches = useMediaQuery(query);

  if (matches) {
    return (
      <BaseLayout hideNavbar>
        <div className="flex flex-col items-center justify-center mx-auto mt-16 max-w-[600px]">
          <Image src="/illustrations/undraw_mobile_devices.svg" width={320} height={280} alt="no mobile support" />
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
