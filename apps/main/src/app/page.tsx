/* eslint-disable max-len */
import Image from 'next/image';
import {
  IconCheck,
  IconBrush,
  IconFlask,
  IconMathOff,
  IconPower,
  IconStar,
  IconUser,
  IconClock,
  IconCopy,
  IconHelp,
  IconTrendingUp,
} from '@tabler/icons-react';

import BaseLayout from 'components/BaseLayout';
import PublicNavbar from 'components/PublicNavbar';
import PricingWidget from 'components/PricingWidget';

export const metadata = {
  title: 'Dealo',
  description: 'A platform to streamline pricing cards and checkouts',
}

const IconListItem = ({ title, text, icon }: { title: string; text: string; icon: JSX.Element }) => (
  <div className="flex items-center flex-nowrap gap-4">
    <div className="flex flex-row justify-center items-center flex-shrink-0 w-[32px] h-[32px]">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text font-bold">{title}</span>
      <span className="text">{text}</span>
    </div>
  </div>
);

const Card = ({ title, text, icon }: { title: string; text: string; icon: JSX.Element }) => {
  return (
    <div className="flex flex-col gap-4 p-6 w-[30%] rounded-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-950">
      {icon}
      <h3 className="text text-lg font-bold">{title}</h3>
      <span className="text">{text}</span>
    </div>
  );
}

const HomePage = () => {
  return (
    <BaseLayout hideNavbar>
      <PublicNavbar />
      <div className="w-full max-w-[1200px] mx-auto my-o flex flex-col items-center">
        <div className="flex justify-center items-center py-24 px-0 gap-[72px]">
          <div className="flex flex-col items-stretch max-w-[30rem]">
            <div className="flex items-center gap-0">
              <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
              <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
            </div>
            <h2 className="text-[40px] leading-[1.2] font-bold">
              A platform to streamline <br />
              <span className="relative py-1 px-3 bg-emerald-500/[.15]">pricing</span>
              <br />
              into your website.
            </h2>
            <span className="mt-4 text-gray-500">
              Build fully functional pricing widgets in minutes using our set of templates.
            </span>

            <ul className="mt-8 flex flex-col gap-2 list-none">
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5} />
                </div>
                <span className="font-light">
                  <span className="font-semibold">Powered by Stripe</span>
                  {` - `}
                  use the products you already have to create a pricing widget in minutes
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5} />
                </div>
                <span className="font-light">
                  <span className="font-semibold">Easy setup</span>
                  {` – `}
                  just copy and paste the code snippets to your website
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-500 rounded-full mt-1 mr-3 p-1 shrink-0">
                  <IconCheck size="12px" color="white" stroke={1.5} />
                </div>
                <span className="font-light">
                  <span className="font-semibold">Easy checkout</span>
                  {` – `}
                  redirect your customers to our checkout API, we will generate a checkout session for you
                </span>
              </li>
            </ul>
          </div>
          <Image src="/illustrations/fitting_piece.svg" width={380} height={400} alt="hero" className="flex-1 hidden lg:block" />
        </div>

        <div className="flex flex-col gap-8 bg-gray-100 dark:bg-gray-900 p-6 rounded mb-[140px]">
          <h1 className="text text-center text-3xl font-bold text-black dark:text-white mb-6">Unleash Your Potential</h1>
          <div className="flex flex-row items-stretch justify-between">
            <Card icon={<IconMathOff />} title="Goodbye to Headaches" text="No more wrangling with code to set up pricing pages and bill your customers."/>
            <Card icon={<IconPower />} title="Empowerment" text="Create and customize sleek, professional pricing cards effortlessly."/>
            <Card icon={<IconFlask />} title="Innovate" text="Use our A/B testing and Insights to find the best pricing combination."/>
          </div>
          <div className="flex flex-row items-stretch justify-between">
            <Card icon={<IconStar />} title="Frictionless Journey" text="Provide your customers with a frictionless checkout experience while you focus on scaling your business." />
            <Card icon={<IconUser />} title="Dynamic Experience" text="Create a dynamic and user-friendly checkout experience." />
            <Card icon={<IconBrush />} title="Your brand is your identity" text="Maintain consistency effortlessly by embedding the generated UI directly into your website." />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-[140px]">
          <h2 className="text text-2xl font-bold ml-12">How it works</h2>
          <h2 className="text text-2xl font-bold ml-12">Why Choose Us?</h2>

          <IconListItem
            icon={<IconBrush/>}
            title="Customize"
            text="Pick from our choise of templates, add your products and splash your colours."
          />
          <IconListItem
            icon={<IconTrendingUp/>}
            title="No-Code, No Limits"
            text="Craft widgets in under 15 minutes and integrate seamlessly with any website."
          />

          <IconListItem icon={<IconCopy/>} title="Embed" text="Copy and paste the provided code snippets to your website."/>
          <IconListItem icon={<IconClock/>} title="Time-Saving" text="Set up your pricing structure in minutes, not hours."/>

          <IconListItem
            icon={<IconCheck size={28}/>}
            title="Checkout"
            text="Redirect your customers to our checkout API for a smooth transaction process."
          />
          <IconListItem icon={<IconHelp/>} title="Comprehensive Support" text="We're more than a tool, we're your dedicated partner."/>
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <h1 className="text text-xl mb-4">Get started now.</h1>
          <PricingWidget />
          <span className="text text-slate-600 dark:text-slate-300 mt-4">This is a working example of a pricing widget.</span>
        </div>
      </div>
    </BaseLayout>
  );
};

export default HomePage;