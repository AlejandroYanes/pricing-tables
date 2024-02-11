/* eslint-disable max-len */
import Link from 'next/link';
import Image from 'next/image';
import {
  IconBrush,
  IconCheck,
  IconClock,
  IconCopy,
  IconFlask,
  IconHelp,
  IconMathOff,
  IconPower,
  IconStar,
  IconTrendingUp,
  IconUser,
} from '@tabler/icons-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, cn } from '@dealo/ui';

import BaseLayout from 'components/base-layout';
import PricingWidget from 'components/pricing-widget';
import PublicNavbar from 'components/public-navbar';

interface IconListItemProps {
  icon: JSX.Element;
  title: string;
  text: string;
  className?: string;
}

const IconListItem = ({ title, text, icon, className }: IconListItemProps) => (
  <div className={cn('flex flex-nowrap gap-4', className)}>
    <div className="flex flex-row justify-center items-center flex-shrink-0 w-[32px] h-[32px]">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="font-bold">{title}</span>
      <span>{text}</span>
    </div>
  </div>
);

interface CardProps {
  title: string;
  text: string;
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

const HomePage = () => {
  return (
    <BaseLayout
      hideNavbar
      className="px-0"
      footerClassName="w-full max-w-[1200px] mx-auto px-4 xl:px-0"
    >
      <PublicNavbar />
      <main className="w-full max-w-[1200px] mx-auto my-o flex flex-col items-center">
        <section data-el="hero-section" className="flex justify-center items-center py-24 px-4 gap-[72px]">
          <div className="flex flex-col items-stretch max-w-[30rem]">
            <div className="flex items-center gap-0">
              <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} className="w-[64px] h-[64px]"/>
              <span className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</span>
            </div>
            <h1 className="text-[40px] leading-[1.2] font-bold">
              A platform to streamline <br/>
              <span className="relative py-1 px-3 bg-emerald-500/[.15]">pricing</span>
              <br/>
              into your website.
            </h1>
            <span className="mt-4 text-gray-500">
              Build fully functional pricing widgets in minutes using our set of templates.
            </span>

            <ul className="mt-8 flex flex-col gap-2 list-none">
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5}/>
                </div>
                <span className="font-light">
                  <span className="font-semibold">Powered by Stripe</span>
                  {` - `}
                  use the products you already have to create a pricing widget in minutes
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5}/>
                </div>
                <span className="font-light">
                  <span className="font-semibold">Easy setup</span>
                  {` – `}
                  just copy and paste the code snippets to your website
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5}/>
                </div>
                <span className="font-light">
                  <span className="font-semibold">Easy checkout</span>
                  {` – `}
                  redirect your customers to our checkout API, we will generate a checkout session for you
                </span>
              </li>
            </ul>

            <div className="mt-10 flex flex-row gap-2">
              <Link href="/#pricing-section">
                <Button>Get started now</Button>
              </Link>
              <Link href="/contact/query">
                <Button variant="outline">Get in touch</Button>
              </Link>
            </div>
          </div>
          <Image
            width={380}
            height={400}
            alt="hero"
            src="/illustrations/undraw_fitting_piece.svg"
            className="flex-1 hidden lg:block w-[380px] h-[400px]"
            priority
          />
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
            <Card icon={<IconPower/>} title="Empowerment" text="Create and customize sleek, professional pricing cards effortlessly."/>
            <Card icon={<IconFlask/>} title="Innovate" text="Use our A/B testing and Insights to find the best pricing combination."/>
          </div>
          <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-4 xl:gap-8">
            <Card
              icon={<IconStar/>}
              title="Frictionless Journey"
              text="Provide your customers with a frictionless checkout experience while you focus on scaling your business."
            />
            <Card icon={<IconUser/>} title="Dynamic Experience" text="Create a dynamic and user-friendly checkout experience."/>
            <Card
              icon={<IconBrush/>}
              title="Your brand is your identity"
              text="Maintain consistency effortlessly by embedding the generated UI directly into your website."
            />
          </div>
        </section>

        <section data-el="description-section__grid" className="hidden md:grid grid-cols-2 gap-6 px-4 mb-24 lg:mb-[140px] max-w-[1000px]">
          <h2 className="text text-2xl font-bold ml-12">How it works</h2>
          <h2 className="text text-2xl font-bold ml-12">Why Choose Us?</h2>

          <IconListItem
            icon={<IconBrush/>}
            className="mb-4 md:mb-0"
            title="Customize"
            text="Pick from our choise of templates, add your products and splash your colours."
          />
          <IconListItem
            className="mb-4 md:mb-0"
            icon={<IconTrendingUp/>}
            title="No-Code, No Limits"
            text="Craft widgets in under 15 minutes and integrate seamlessly with any website."
          />

          <IconListItem
            className="mb-4 md:mb-0"
            icon={<IconCopy/>}
            title="Embed"
            text="Copy and paste the provided code snippets to your website."
          />
          <IconListItem
            className="mb-4 md:mb-0"
            icon={<IconClock/>}
            title="Time-Saving"
            text="Set up your pricing structure in minutes, not hours."
          />

          <IconListItem
            className="mb-4 md:mb-0"
            icon={<IconCheck size={28}/>}
            title="Checkout"
            text="Redirect your customers to our checkout API for a smooth transaction process."
          />
          <IconListItem
            icon={<IconHelp/>}
            title="Comprehensive Support"
            text="We're more than a tool, we're your dedicated partner."
          />
        </section>

        <section data-el="description-section__columns" className="md:hidden flex flex-col px-4 mb-24 lg:mb-[140px]">
          <h2 className="text text-2xl font-bold mt-8 md:mt-0 mb-6 md:mb-0 md:ml-12 order-1">How it works</h2>
          <h2 className="text text-2xl font-bold mt-8 md:mt-0 mb-6 md:mb-0 md:ml-12 order-5">Why Choose Us?</h2>

          <IconListItem
            icon={<IconBrush/>}
            className="order-2 mb-4 md:mb-0"
            title="Customize"
            text="Pick from our choise of templates, add your products and splash your colours."
          />
          <IconListItem
            className="order-3 mb-4 md:mb-0"
            icon={<IconTrendingUp/>}
            title="No-Code, No Limits"
            text="Craft widgets in under 15 minutes and integrate seamlessly with any website."
          />

          <IconListItem
            className="order-4 mb-4 md:mb-0"
            icon={<IconCopy/>}
            title="Embed"
            text="Copy and paste the provided code snippets to your website."
          />
          <IconListItem
            className="order-6 mb-4 md:mb-0"
            icon={<IconClock/>}
            title="Time-Saving"
            text="Set up your pricing structure in minutes, not hours."
          />

          <IconListItem
            className="order-7 mb-4 md:mb-0"
            icon={<IconCheck size={28}/>}
            title="Checkout"
            text="Redirect your customers to our checkout API for a smooth transaction process."
          />
          <IconListItem
            className="order-8"
            icon={<IconHelp/>}
            title="Comprehensive Support"
            text="We're more than a tool, we're your dedicated partner."
          />
        </section>

        <section data-el="pricing-section" id="pricing-section" className="flex flex-col items-center justify-center mt-6 w-full">
          <h2 className="text-3xl font-bold mb-4">Get started now.</h2>
          <PricingWidget/>
          <span className="text-slate-600 dark:text-slate-300 mt-4">This is a working example of a pricing widget.</span>
        </section>

        <section id="faq-section" data-el="faq-section" className="flex flex-col items-center justify-center px-2 mt-14 w-full max-w-[700px]">
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
};

export default HomePage;
