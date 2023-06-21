import Image from 'next/image';
import { IconCheck } from '@tabler/icons';

import BaseLayout from 'components/BaseLayout';
import SignInForm from 'components/SignInForm';

export const metadata = {
  title: 'Dealo',
  description: 'A platform to streamline pricing cards and checkouts',
}

const HomePage = () => {
  return (
    <BaseLayout hideNavbar>
      <div className="w-full max-w-[1200px] mx-auto my-o flex flex-col items-center">
        <div className="flex justify-center items-center py-24 px-0 gap-[72px]">
          <div className="flex flex-col items-stretch max-w-[30rem]">
            <div className="flex items-center gap-0">
              <Image src="/logo/dealo_logo_letter.svg" alt="Dealo" width={64} height={64} />
              <h1 className="mb-4 text-[64px] leading-[1.2] font-black text-emerald-500">ealo</h1>
            </div>
            <h2 className="text-[40px] leading-[1.2] font-bold">
              A platform to streamline <br />
              <span className="relative py-1 px-3 bg-emerald-500/[.15]">pricing cards</span>
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

            <a
              href="https://www.producthunt.com/posts/dealo?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-dealo"
              target="_blank"
              rel="noreferrer"
              style={{ margin: '60px auto 0' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                // eslint-disable-next-line max-len
                src={`https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=393090&theme=light&period=weekly&topic_id=237`}
                alt="Dealo - Pricing&#0032;cards&#0032;and&#0032;checkouts&#0032;for&#0032;no&#0045;code | Product Hunt"
                style={{ width: '250px', height: '54px' }}
                width="250"
                height="54"
              />
            </a>
          </div>
          <Image src="/illustrations/fitting_piece.svg" width={380} height={400} alt="hero" className="flex-1 hidden lg:block" />
        </div>
        <div className="flex mt-8 flex-col-reverse items-center lg:flex-row lg:items-start gap-4">
          <div className="flex flex-col lg:flex-1 lg:max-w-[50%]">
            <SignInForm />
          </div>
          <div className="flex flex-col lg:flex-1 lg:max-w-[50%]">
            <iframe
              src="https://www.youtube-nocookie.com/embed/EwyFL4IT9Mo"
              title="Pricing Cards Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              width="560"
              height="315"
              allowFullScreen
              className="hidden sm:block"
              style={{ border: 'none' }}
            >
            </iframe>
            <iframe
              src="https://www.youtube-nocookie.com/embed/EwyFL4IT9Mo"
              title="Pricing Cards Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              width="320"
              height="260"
              allowFullScreen
              className="block sm:hidden mb-8"
              style={{ border: 'none' }}
            >
            </iframe>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default HomePage;
