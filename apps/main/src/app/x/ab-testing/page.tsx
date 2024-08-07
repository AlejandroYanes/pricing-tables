/* eslint-disable max-len */
import Link from 'next/link';
import { IconBrush, IconFlask, IconMathOff, IconPower, IconStar, IconUser, } from '@tabler/icons-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, cn } from '@dealo/ui';

import BaseLayout from 'components/base-layout';
import PublicNavbar from 'components/public-navbar';
import CookiesBanner from 'components/cookies-banner';

interface CardProps {
  title: string;
  text: string | JSX.Element;
  icon: JSX.Element;
  className?: string;
}

const Card = ({ title, text, icon, className }: CardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-6 flex-1 rounded-sm',
        'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-950',
        className,
      )}
    >
      {icon}
      <h3 className="text-lg font-bold">{title}</h3>
      <span>{text}</span>
    </div>
  );
}

export default function ABTestingPage() {
  return (
    <BaseLayout
      hideNavbar
      className="px-0"
      footerClassName="w-full max-w-[1200px] mx-auto px-4 xl:px-0"
    >
      <PublicNavbar showLogo hidePricing />
      <main className="w-full max-w-[1200px] mx-auto my-o flex flex-col items-center">
        <section data-el="hero-section" className="flex flex-col items-center py-24 px-4">
          <h1 className="text-5xl leading-[1.2] font-bold text-center">
            Find the perfect pricing model
          </h1>
          <div className="flex flex-col mt-6 text-center text-[24px] text-slate-700 dark:text-neutral-300">
            <span>
              Our platform allows you to create and customize pricing widgets in minutes.
            </span>
            <span className="mt-3 md:mt-0">
              Use our <strong>A/B testing</strong> and <strong>Insights</strong> to find the best pricing combination for your business.
            </span>
          </div>
          <span className="mt-4 text-xl text-slate-700 dark:text-neutral-200 text-center">
            Powered by Stripe.
          </span>
          <div className="mt-10 flex flex-row gap-2">
            <Link href="/signin">
              <Button>Get started now</Button>
            </Link>
            <Link href="/contact/query">
              <Button variant="outline">Get in touch</Button>
            </Link>
          </div>
        </section>

        <section
          data-el="benefits-section"
          className="flex flex-col gap-8 xl:rounded bg-gray-100 dark:bg-gray-900 px-2 lg:px-6 pt-6 pb-10 mb-16 md:mb-24 lg:mb-[140px]"
        >
          <h2 className="text text-center text-3xl font-bold text-black dark:text-white">Unleash Your Potential</h2>
          <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-4 xl:gap-8">
            <Card
              icon={<IconMathOff/>}
              title="Goodbye to Headaches"
              text="No more wrangling with code to set up pricing pages and bill your customers."
            />
            <Card icon={<IconUser/>} title="Dynamic Experience" text="Create a dynamic and user-friendly checkout experience."/>
            <Card
              icon={<IconFlask/>}
              title="Innovate"
              text={
                <>
                  Use our <strong>A/B testing</strong> and <strong>Insights</strong> to find the best pricing combination.
                </>
              }
            />
          </div>
          <div className="hidden md:flex md:items-stretch justify-between gap-4 xl:gap-8">
            <Card
              icon={<IconStar/>}
              title="Frictionless Journey"
              text="Provide your customers with a frictionless checkout experience while you focus on scaling your business."
            />
            <Card icon={<IconPower/>} title="Empowerment" text="Create and customize sleek, professional pricing cards effortlessly."/>
            <Card
              icon={<IconBrush/>}
              title="Your brand is your identity"
              text="Maintain consistency effortlessly by embedding the generated UI directly into your website."
            />
          </div>
        </section>

        <section
          id="faq-section"
          data-el="faq-section"
          className="flex flex-col items-center justify-center px-2 mt-14 w-full max-w-[700px]"
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
                  Absolutely! We understand the importance of brand consistency.
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
                  Absolutely! We offer a risk-free trial period for you to explore the full capabilities of our platform.
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
      <CookiesBanner />
    </BaseLayout>
  );
}
