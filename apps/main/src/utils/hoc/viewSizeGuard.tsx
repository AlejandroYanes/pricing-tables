import type { JSXElementConstructor } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';

import BaseLayout from 'components/BaseLayout';
import { Button } from 'components/ui/button';

const query = '(max-width: 1024px)';

export default function viewSizeGuard(Component: JSXElementConstructor<any> | null) {
  return (props: any) => {
    const router = useRouter();
    const matches = useMediaQuery(query);

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

    if (!Component) {
      return null;
    }

    return <Component {...props} />;
  };
}
