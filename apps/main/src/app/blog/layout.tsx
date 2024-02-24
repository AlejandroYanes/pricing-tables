import BaseLayout from 'components/base-layout';
import PublicNavbar from 'components/public-navbar';
import CookiesBanner from 'components/cookies-banner';

export default function BlogsLayout({ children }: { children: any }) {
  return (
    <BaseLayout hideNavbar className="px-0" footerClassName="w-full max-w-[1200px] mx-auto px-4 xl:px-0">
      <PublicNavbar showHome />
      {children}
      <CookiesBanner />
    </BaseLayout>
  );
}
