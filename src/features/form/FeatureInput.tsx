import { Checkbox, TextInput } from '@mantine/core';

import type { FeatureType, FeatureValue } from 'models/stripe';

interface Props {
  type: FeatureType;
  value: FeatureValue;
  onChange: (nextValue: FeatureValue) => void;
}

export default function FeatureInput(props: Props) {
  const { type, value, onChange } = props;

  switch (type) {
    case 'boolean':
      return (
        <Checkbox
          checked={value as boolean}
          onChange={() => undefined}
          onClick={() => onChange(!value)}
        />
      );
    case 'string':
      return (
        <TextInput value={value as string} onChange={(e) => onChange(e.target.value)} />
      );
    default:
      return null;
  }
}
