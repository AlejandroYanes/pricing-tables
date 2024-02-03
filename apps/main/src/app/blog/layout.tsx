import BaseLayout from 'components/base-layout';
import PublicNavbar from 'components/public-navbar';

export default function MdxLayout({ children }: { children: any }) {
  return (
    <BaseLayout hideNavbar footerClassName="w-full max-w-[1200px] mx-auto">
      <PublicNavbar showHome />
      {children}
    </BaseLayout>
  );
}
