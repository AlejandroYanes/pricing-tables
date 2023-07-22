/* eslint-disable max-len */
import type { ReactNode } from 'react';
import { IconClipboard } from '@tabler/icons-react';

import { Button } from './button';
import { cn } from './helpers';

interface Props {
  children: ReactNode;
  className?: string;
}

export function CodeBlock(props: Props) {
  const { children, className } = props;
  return (
    <div className={cn('flex relative rounded-sm bg-slate-50 dark:bg-slate-900 group', className)}>
      <code className="w-full text text-sm font-mono whitespace-break-spaces py-5 px-4 overflow-auto">
        {children}
      </code>
      <Button size="sm" variant="secondary" className="h-7 w-7 p-0 absolute top-2 right-2 invisible group-hover:visible">
        <IconClipboard size={16} className="text-slate-600 dark:text-slate-200" />
      </Button>
    </div>
  );
}
