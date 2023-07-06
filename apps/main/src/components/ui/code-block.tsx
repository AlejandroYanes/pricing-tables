import { IconClipboard } from '@tabler/icons-react';

import { cn } from 'utils/ui';
import { Button } from './button';

interface Props {
  code: string;
  className?: string;
}

export default function CodeBlock(props: Props) {
  const { code, className } = props;
  return (
    <code className={cn('text text-sm font-mono whitespace-break-spaces rounded-sm bg-neutral-50 p-4 relative', className)}>
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 absolute top-2 right-2">
        <IconClipboard size={16} className="text-neutral-600" />
      </Button>
      {code}
    </code>
  );
}
