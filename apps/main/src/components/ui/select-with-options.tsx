import { RenderIf } from '@dealo/ui';

import { cn } from 'utils/ui';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from './select';
import { Label } from './label';

type Item = { value: string; label: string };

interface Props {
  label?: string;
  value: string;
  options: Item[];
  onValueChange: (value: string) => void;
  className?: string;
}

export default function SelectWithOptions(props: Props) {
  const { label, options, value, onValueChange, className } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <RenderIf condition={!!label}>
        <Label>{label}</Label>
      </RenderIf>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
