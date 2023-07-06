import { RenderIf } from '@dealo/ui';

import { cn } from 'utils/ui';
import { Input, type InputProps } from './input';
import { Label } from './label';

interface Props extends InputProps {
  label: string;
  error?: string | boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export default function InputWithLabel(props: Props) {
  const { label, id, error, className, inputClassName, labelClassName, ...rest } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className={labelClassName}>{label}</Label>
      <Input id={id} className={cn(!!error ? 'border-destructive' : null, inputClassName)} {...rest} />
      <RenderIf condition={!!error && typeof error === 'string'}>
        <span className="text-sm text-destructive-foreground">{error}</span>
      </RenderIf>
    </div>
  );
}
