import type { ReactNode } from 'react';

interface Props {
  condition: boolean;
  children: ReactNode;
  fallback?: any;
}

const RenderIf = (props: Props) => {
  const {
    children,
    condition,
    fallback = null,
  } = props;

  if (condition) {
    return children;
  }

  return fallback;
};

export default RenderIf;
