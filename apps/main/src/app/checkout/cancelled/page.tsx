import { IconMoodConfuzed } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <div className="flex flex-col text-center justify-center h-[100vh]">
        <div className="flex">
          <IconMoodConfuzed size={88} />
          <h3 className="text text-[36px] w-[360px]">Payment was cancelled.</h3>
        </div>
      </div>
    </BaseLayout>
  );
}
