import { render } from '@react-email/render';
import { NewReleaseEmail } from '@dealo/email-templates';

import { env } from 'env/server.mjs';
import BaseLayout from 'components/BaseLayout';
import EmailForm from './EmailForm';

const URL = env.PLATFORM_URL || `https://${process.env.VERCEL_URL}`;
const logoImage = `${URL}/logo/dealo_logo_block.png`;

const EmailsPage = () => {
  const markup = render(<NewReleaseEmail logoImage={logoImage} />, { pretty: true });

  return (
    <BaseLayout title="Email">
      <div className="flex gap-8">
        <div className="flex flex-col gap-6 w-[35%]">
          <EmailForm />
        </div>
        <div className="flex flex-col gap-6 mx-auto min-w-[700px]">
          <iframe srcDoc={markup} className="w-full h-[calc(100vh_-_70px)]"/>
        </div>
      </div>
    </BaseLayout>
  );
};

export default EmailsPage;
