import { Checkbox, Select, Stack, Text, TextInput } from '@mantine/core';

import type { FormProduct } from 'models/stripe';
import RenderIf from 'components/RenderIf';
import TwoColumnsLayout from './TwoColumnsLayout';
import { ReactNode } from 'react';

interface Props {
  template: ReactNode;
  products: FormProduct[];
  recommended: string | undefined;
  onRecommendedChange: (next: string) => void;
  usesUnitLabel: boolean;
  unitLabel: string | undefined;
  onToggleUnitLabels: () => void;
  onUnitLabelChange: (nextLabel: string) => void;
  subscribeLabel: string;
  onSubscribeLabelChange: (nextLabel: string) => void;
  freeTrialLabel: string;
  onFreeTrialLabelChange: (nextLabel: string) => void;
}

export default function SettingsForm(props: Props) {
  const {
    template,
    products,
    recommended,
    onRecommendedChange,
    usesUnitLabel,
    unitLabel,
    onToggleUnitLabels,
    onUnitLabelChange,
    subscribeLabel,
    onSubscribeLabelChange,
    freeTrialLabel,
    onFreeTrialLabelChange,
  } = props;

  const options = products.map((prod) => ({ label: prod.name, value: prod.id }));

  const panel = (
    <>
      <Select label="Recommended Product" data={options} value={recommended} onChange={onRecommendedChange} />
      <TextInput label="CTA button label" value={subscribeLabel} onChange={(e) => onSubscribeLabelChange(e.target.value)} />
      <TextInput label="Free trial button label" value={freeTrialLabel} onChange={(e) => onFreeTrialLabelChange(e.target.value)} />
      <Checkbox
        mt="md"
        label="Use unit labels"
        checked={usesUnitLabel}
        onChange={() => undefined}
        onClick={onToggleUnitLabels}
      />
      <RenderIf condition={usesUnitLabel}>
        <TextInput
          mt={-12}
          label="Label"
          value={unitLabel}
          onChange={(e) => onUnitLabelChange(e.target.value)}
        />
      </RenderIf>
    </>
  );

  return (
    <TwoColumnsLayout leftContent={panel} rightContent={template} />
  );
}
