import { RenderIf } from '@dealo/ui';
import { Input, type InputProps } from './input';
import { Label } from './label';
import { cn } from './helpers';

interface Props extends InputProps {
  label: string;
  error?: string | boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

function InputWithLabel(props: Props) {
  const { label, id, error, className, inputClassName, labelClassName, required, ...rest } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className={labelClassName}>{label} {required ? <span>*</span> : null}</Label>
      <Input id={id} className={cn(!!error ? 'border-destructive' : null, inputClassName)} required={required} {...rest} />
      <RenderIf condition={!!error && typeof error === 'string'}>
        <span className="text-sm text-destructive-foreground">{error}</span>
      </RenderIf>
    </div>
  );
}

export { InputWithLabel };
