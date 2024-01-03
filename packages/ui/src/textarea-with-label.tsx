
import { Label } from './label';
import { Textarea, type TextareaProps } from './textarea';
import { RenderIf } from './render-if';
import { cn } from './helpers';

interface Props extends TextareaProps {
  label: string;
  error?: string | boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

function TextareaWithLabel(props: Props) {
  const { label, id, error, className, inputClassName, labelClassName, ...rest } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className={labelClassName}>{label}</Label>
      <Textarea id={id} className={cn(!!error ? 'border-destructive' : null, inputClassName)} {...rest} />
      <RenderIf condition={!!error && typeof error === 'string'}>
        <span className="text-sm text-destructive-foreground">{error}</span>
      </RenderIf>
    </div>
  );
}

export { TextareaWithLabel };