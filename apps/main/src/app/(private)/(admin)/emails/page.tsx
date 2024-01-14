import { render } from '@react-email/render';
import { InputWithLabel } from '@dealo/ui';
import { NewReleaseEmail } from '@dealo/email-templates';

import { env } from 'env/server.mjs';
import BaseLayout from 'components/BaseLayout';

const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

const EmailsPage = () => {
  const markup = render(<NewReleaseEmail logoImage={logoImage} />, { pretty: true });

  return (
    <BaseLayout title="Email">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-6 min-w-[700px]">
          <InputWithLabel label="To"/>
          <InputWithLabel label="Subject"/>
          <h3 className="text-2xl text-left">Preview:</h3>
          <iframe srcDoc={markup} className="w-full h-[calc(100vh_-_70px)]"/>
        </div>
      </div>
    </BaseLayout>
  );
};

export default EmailsPage;
