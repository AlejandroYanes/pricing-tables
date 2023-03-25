import { Checkbox, Text, TextInput } from '@mantine/core';

import type { FormProduct } from 'models/stripe';
import RenderIf from 'components/RenderIf';

interface Props {
  products: FormProduct[];
  usesUnitLabel: boolean;
  unitLabel: string | undefined;
  onToggleUnitLabels: () => void;
  onUnitLabelChange: (nextLabel: string) => void;
}

export default function SettingsForm(props: Props) {
  const { usesUnitLabel, unitLabel, onToggleUnitLabels, onUnitLabelChange } = props;

  return (
    <>
      <Text mb="xl">Settings</Text>
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
