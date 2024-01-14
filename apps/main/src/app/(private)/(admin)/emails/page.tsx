'use client';
import { InputWithLabel } from '@dealo/ui';
import { NewReleaseEmail } from '@dealo/email-templates';

import { env } from 'env/server.mjs';
import BaseLayout from 'components/BaseLayout';

const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

const EmailsPage = () => {
  return (
    <BaseLayout title="Email" className="items-center justify-center">
      <div className="flex flex-col gap-6 min-w-[700px]">
        <InputWithLabel label="To" />
        <InputWithLabel label="Subject" />
        <h3 className="text-2xl text-left">Preview:</h3>
        <NewReleaseEmail logoImage={logoImage} />
      </div>
    </BaseLayout>
  );
};

export default EmailsPage;
