import { IconBug, IconHelp } from '@tabler/icons-react';

import BaseLayout from 'components/base-layout';
import PublicNavbar from 'components/public-navbar';
import Card from './Card';

interface Props {
  children?: any;
}

export default function ContactPageLayout(props: Props) {
  const { children } = props;

  return (
    <BaseLayout
      hideNavbar
      className="px-4 md:px-12"
      footerClassName="w-full max-w-[1200px] mx-auto"
    >
      <PublicNavbar showHome />
      <main className="flex flex-col md:flex-row justify-center gap-14 mx-auto mt-10 md:max-w-[980px]">
        <aside className="flex flex-col gap-10">
          <h1 className="text-4xl text-left mb-4">Get in touch</h1>
          <Card
            to="/contact/query"
            title="Send a query"
            text="Ask any questions you have"
            icon={<IconHelp/>}
          />
          <Card
            to="/contact/report"
            title="Open a support ticket"
            text="Troubleshoot a technical issue or payment problem."
            icon={<IconBug/>}
          />
        </aside>
        {children}
      </main>
    </BaseLayout>
  );
}
