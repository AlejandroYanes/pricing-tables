import { render } from '@react-email/render';
import { NewReleaseEmail } from '@dealo/email-templates';

import { env } from 'env/server.mjs';
import BaseLayout from 'components/base-layout';
import InternalEmailForm from './InternalEmailForm';

const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

const EmailsPage = () => {
  const markup = render(<NewReleaseEmail logoImage={logoImage} />, { pretty: true });

  return (
    <BaseLayout title="Email" hideFooter>
      <div className="flex items-stretch gap-8 h-[calc(100vh_-_88px_-_32px)]">
        <div className="flex flex-col w-[35%]">
          <InternalEmailForm />
        </div>
        <div className="flex flex-col items-center gap-6 mx-auto min-w-[740px]">
          <iframe srcDoc={markup} className="w-full h-[calc(100vh_-_88px_-_32px)]"/>
        </div>
      </div>
    </BaseLayout>
  );
};

export default EmailsPage;
