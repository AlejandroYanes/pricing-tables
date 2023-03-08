import { useForm } from '@mantine/form';
import { Checkbox, Group, Modal, SegmentedControl, Select, Stack, TextInput } from '@mantine/core';

const pricingModels = [
  { label: 'Standard pricing', value: 'standard' },
  { label: 'Package pricing', value: 'package' },
  { label: 'Graduated pricing', value: 'graduated' },
  { label: 'Volume pricing', value: 'volume' },
];

const currencies = [
  { label: 'GBP', value: 'gbp', symbol: '£' },
  { label: 'USD', value: 'usd', symbol: '$' },
  { label: 'EUR', value: 'eur', symbol: 'eur' },
];

const recurringOptions = [
  { label: 'Recurring', value: 'recurring' },
  { label: 'One time', value: 'on-time' },
];

const billingOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Every 3 months', value: '3-months' },
  { label: 'Every 6 months', value: '6-months' },
  { label: 'Yearly', value: 'yearly' },
];

const meteredOptions = [
  { label: 'Sum of usage values during period', value: 'sum' },
  { label: 'Most recent usage value during period', value: 'recent' },
  { label: 'Most recent usage value', value: 'all-time' },
  { label: 'Maximum usage value during period', value: 'max' },
];

export default function PriceForm() {
  const form = useForm({
    initialValues: {
      billingScheme: 'standard',
      price: '0',
      currency: 'gbp',
      isRecurring: 'on-time',
      billingPeriod: 'monthly',
      isMetered: false,
      aggregateUsage: 'sum',
    },
  });
  return (
    <Modal opened onClose={() => undefined}>
      <form>
        <Stack>
          <Select label="Pricing Model" data={pricingModels} {...form.getInputProps('billingScheme')} />
          <Group>
            <TextInput label="Price" {...form.getInputProps('price')} />
            <Select data={currencies} {...form.getInputProps('currency')} />
          </Group>
          <SegmentedControl data={recurringOptions} {...form.getInputProps('isRecurring')} />
          <Select data={billingOptions} {...form.getInputProps('billingPeriod')} />
          <Checkbox label="Usage is metered" {...form.getInputProps('isMetered')} />
          <Select label="Charge for metered usage by" data={meteredOptions} {...form.getInputProps('aggregateUsage')} />
        </Stack>
      </form>
    </Modal>
  );
}
