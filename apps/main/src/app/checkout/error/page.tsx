import { IconAlertTriangle } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutError() {
  return (
    <BaseLayout hideNavbar>
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="flex">
          <IconAlertTriangle size={88} />
          <h3 className="text text-[36px] w-[360px]">
            Something went wrong, please contact support at {' '}
            <a href="mailto:alejandro.yanes94@gmail.com">alejandro.yanes94@gmail.com</a>
            .
          </h3>
        </div>
      </div>
    </BaseLayout>
  );
}
