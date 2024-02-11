/* eslint-disable max-len */
import Link from 'next/link';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@dealo/ui';

import BaseLayout from 'components/base-layout';
import PricingWidget from 'components/pricing-widget';
import PublicNavbar from 'components/public-navbar';

export default function NewBillingPage() {
  return (
    <BaseLayout
      hideNavbar
      className="px-0"
      footerClassName="w-full max-w-[1200px] mx-auto px-4 xl:px-0"
    >
      <PublicNavbar showLogo />
      <main className="w-full max-w-[1200px] mx-auto my-o flex flex-col items-center">
        <section data-el="hero-section" className="flex flex-col items-center py-24 px-4">
          <h1 className="text-center text-5xl leading-[1.2] font-bold">
            Start billing your customers in minutes
          </h1>
          <span className="mt-4 text-[24px] text-slate-700 dark:text-neutral-300 text-center">
            Effortless setup, seamless integration, rapid growth.
          </span>
          <div className="mt-10 flex flex-row gap-2">
            <Link href="#pricing-section">
              <Button>Get started now</Button>
            </Link>
            <Link href="/contact/query">
              <Button variant="outline">Get in touch</Button>
            </Link>
          </div>
        </section>

        <div className="bg-neutral-100 dark:bg-slate-800 p-4 rounded-sm">
          <Image
            unoptimized
            src="/images/form_page_preview.jpg"
            alt="Form page preview"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>

        <section data-el="pricing-section" id="pricing-section" className="flex flex-col items-center justify-center mt-24 w-full">
          <h2 className="text-3xl font-bold mb-4">This is how it looks out in the world</h2>
          <PricingWidget/>
        </section>

        <section
          id="faq-section"
          data-el="faq-section"
          className="flex flex-col items-center justify-center px-2 mt-24 w-full max-w-[700px]"
        >
          <h2 className="text-center text-3xl font-bold mb-8">FAQ</h2>
          <Accordion type="single" className="w-full">
            <AccordionItem value="use-case" title="What can I use this for?">
              <AccordionTrigger className="text-lg">
                What can I use this for?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  Our platform is aimed at reducing the friction of implementing pricing into your website.
                  We integrate with Stripe to read your products and prices, so you {`don't`} have to do anything new.
                  We also aim to add more features to our platform to help you find that pricing sweet spot.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="security" title="How secure is the integration with Stripe?">
              <AccordionTrigger className="text-lg">
                How secure is the integration with Stripe?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  The security of your data is of great importance to us. Our integration with Stripe Connect means
                  you {`don't`} have to provide your API keys. We use webhooks to receive data from Stripe, but we do not
                  store any sensitive data related to your transactions on our servers.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="customisation" title="Can I customize the generated UI to match my brand's identity?">
              <AccordionTrigger className="text-lg">
                Can I customize the generated UI to match my {`brand's`} identity?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  We understand the importance of brand consistency.
                  Our platform allows you to customize the generated UI in lots of ways.
                  If you find that you need more customization options, please reach out to us at{' '}
                  <a href="mailto:support@dealo.app" className="underline hover:text-emerald-500">support@dealo.app</a>.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="implementation" title="What if I encounter issues during the setup process?">
              <AccordionTrigger className="text-lg">
                What if I encounter issues during the setup process?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  Our setup process is designed to be as simple as possible. Once you connect your Stripe account,
                  you can start creating pricing widgets immediately. When it comes to embedding the generated UI
                  into your website, we provide you with code snippets that you can copy and paste into your website.
                  If you encounter any issues, please reach out to us at{' '}
                  <a href="mailto:support@dealo.app" className="underline hover:text-emerald-500">support@dealo.app</a>.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="trials" title="Can I test the platform before committing?">
              <AccordionTrigger className="text-lg">
                Can I test the platform before committing?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  We offer a risk-free trial period for you to explore the full capabilities of our platform.
                  Take your time to test features, experience the seamless integration with Stripe,
                  and ensure that our platform aligns with your business goals.
                  No commitment required during the trial.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="deletion" title="Can I delete my account?">
              <AccordionTrigger className="text-lg">
                Can I delete my account?
              </AccordionTrigger>
              <AccordionContent>
                <p className="py-4 text-base">
                  Yes, at any point in time, you can delete your account.
                  We will disconnect your Stripe account from our platform and delete all information regarding your widgets.
                  We do not however delete your personal information (eg: name and email) from our database,
                  this is to prevent abuse of our free trial or refund policy.
                  Your information will not be used for any other purpose.
                  If you want a refund, please reach out to us at{' '}
                  <a href="mailto:support@dealo.app" className="underline hover:text-emerald-500">support@dealo.app</a>.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </BaseLayout>
  );
}
