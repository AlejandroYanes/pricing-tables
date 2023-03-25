import { Checkbox, Select, Text, TextInput } from '@mantine/core';

import type { FormProduct } from 'models/stripe';
import RenderIf from 'components/RenderIf';

interface Props {
  products: FormProduct[];
  recommended: string | undefined;
  onRecommendedChange: (next: string) => void;
  usesUnitLabel: boolean;
  unitLabel: string | undefined;
  onToggleUnitLabels: () => void;
  onUnitLabelChange: (nextLabel: string) => void;
}

export default function SettingsForm(props: Props) {
  const { products, recommended, usesUnitLabel, unitLabel, onToggleUnitLabels, onUnitLabelChange, onRecommendedChange } = props;

  const options = products.map((prod) => ({ label: prod.name, value: prod.id }));

  return (
    <>
      <Text mb="xl">Settings</Text>
      <Select label="Recommended Product" data={options} value={recommended} onChange={onRecommendedChange} />
      <Checkbox
        label="Use unit labels"
        checked={usesUnitLabel}
        onClick={onToggleUnitLabels}
      />
      <RenderIf condition={usesUnitLabel}>
        <TextInput
          mb="xs"
          label="Unit label"
          value={unitLabel}
          onChange={(e) => onUnitLabelChange(e.target.value)}
        />
      </RenderIf>
    </>
  );
}
