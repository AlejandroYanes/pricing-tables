/* eslint-disable max-len */
import { IconBug, IconHelp } from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';
import ContactForm from './ContactForm';
import ReportForm from './ReportForm';
import Card from './Card';

interface Props {
  searchParams: Record<string, string | undefined>;
}

const ContactUsPage = (props: Props) => {
  const { searchParams } = props;
  const section = searchParams.section || 'contact';

  return (
    <BaseLayout showBackButton backRoute="/dashboard" title="Contact Us" className="px-4 md:px-12">
      <div className="flex flex-col md:flex-row justify-center gap-14 mx-auto mt-10 md:max-w-[980px]">
        <div className="flex flex-col gap-10">
          <Card
            active={section === 'contact'}
            to="/contact?section=contact"
            title="Send a query"
            text="Ask any questions you have"
            icon={<IconHelp />}
          />
          <Card
            active={section === 'report'}
            to="/contact?section=report"
            title="Open a support ticket"
            text="Troubleshoot a technical issue or payment problem."
            icon={<IconBug />}
          />
        </div>
        {section === 'contact' ? <ContactForm /> : <ReportForm />}
      </div>
    </BaseLayout>
  );
};

export default ContactUsPage;
