'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, cn } from '@dealo/ui';

import { useMediaQuery } from 'utils/hooks/use-media-query';

interface Props {
  children: any;
}

const query = '(max-width: 1280px)';

const ViewSizeGuard = (props: Props) => {
  const router = useRouter();
  const matches = useMediaQuery(query);

  useEffect(() => {
    if (matches) {
      document.body.setAttribute('data-scroll', 'blocked');
    } else {
      document.body.setAttribute('data-scroll', 'allow');
    }
  }, [matches]);

  return (
    <>
      {props.children}
      {matches ? (
        <div
          data-visible={matches}
          className={cn(
            'absolute top-0 right-0 bottom-0 left-0 z-30 bg-background',
            'flex flex-col items-center justify-center mx-auto h-screen',
            'hidden data-[visible=true]:flex'
          )}
        >
          <Image src="/illustrations/undraw_mobile_devices.svg" width={320} height={280} alt="no mobile support"/>
          <h2 className="text text-4xl font-semibold align-center my-6">
            No small screen support.
          </h2>
          <span className="text align-center mb-5">
            We currently do not support small screens, we are working on it.
            <br/>
            Please use a desktop device to access the platform.
          </span>
          <Button variant="outline" onClick={() => router.push('/')}>Go back</Button>
        </div>
      ) : null}
    </>
  );
};

export default ViewSizeGuard;
