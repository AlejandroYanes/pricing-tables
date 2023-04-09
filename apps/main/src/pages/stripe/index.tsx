import { Text, Title } from '@mantine/core';

import authGuard from 'utils/hoc/authGuard';
import BaseLayout from 'components/BaseLayout';

const StripePage = () => {
  return (
    <BaseLayout>
      <Title mb="xl">Stripe Page (empty)</Title>
      <Text mt="">There are no products to list...</Text>
    </BaseLayout>
  );
};

export default authGuard(StripePage);
