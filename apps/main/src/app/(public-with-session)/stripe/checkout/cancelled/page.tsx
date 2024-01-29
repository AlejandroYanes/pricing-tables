import { IconMoodConfuzed } from '@tabler/icons-react';

import BaseLayout from 'components/base-layout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="flex flex-row items-center">
          <IconMoodConfuzed size={88} />
          <h3 className="text text-2xl ml-12 w-[360px]">Payment was cancelled.</h3>
        </div>
      </div>
    </BaseLayout>
  );
}
