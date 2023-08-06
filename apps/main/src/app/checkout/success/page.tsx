import { IconConfetti } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutSuccess() {
  return (
    <BaseLayout hideNavbar>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="flex">
          <IconConfetti size={88} />
          <h3 className="text text-[36px] w-[360px]">Payment received successfully</h3>
        </div>
      </div>
    </BaseLayout>
  );
}
