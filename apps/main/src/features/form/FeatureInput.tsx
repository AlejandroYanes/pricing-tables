import type { FeatureType } from '@dealo/models';

import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';

interface Props {
  type: FeatureType;
  value: string;
  onChange: (nextValue: string) => void;
}

export default function FeatureInput(props: Props) {
  const { type, value, onChange } = props;

  switch (type) {
    case 'boolean':
      return (
        <Checkbox
          checked={value === 'true'}
          onChange={() => undefined}
          onClick={() => onChange(value === 'true' ? 'false' : 'true')}
        />
      );
    case 'string':
    case 'compose':
      return (
        <Input value={value as string} onChange={(e) => onChange(e.target.value)}/>
      );
    default:
      return null;
  }
}
