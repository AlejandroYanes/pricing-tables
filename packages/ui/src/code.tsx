import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function Code(props: Props) {
  const { children } = props;
  return (
    <code className="relative rounded bg-neutral-50 px-[0.3rem] py-[0.2rem] font-mono text-sm">
      {children}
    </code>
  );
}

export { Code };
