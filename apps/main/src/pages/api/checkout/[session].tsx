import { useRouter } from 'next/router';

import BaseLayout from 'components/BaseLayout';

export default function CheckoutSession() {
  const { query } = useRouter();
  return (
    <BaseLayout hideNavbar>
      <h1>Checkout Session</h1>
      {JSON.stringify(query)}
    </BaseLayout>
  );
}
