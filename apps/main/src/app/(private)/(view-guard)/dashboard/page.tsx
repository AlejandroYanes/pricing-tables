import type { Metadata } from 'next';

import BaseLayout from 'components/base-layout';
import WidgetsList from './WidgetsList';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'A list of all your widgets',
};

export default async function DashboardPage() {
  return (
    <BaseLayout title="Dashboard">
      <WidgetsList/>
    </BaseLayout>
  );
}
