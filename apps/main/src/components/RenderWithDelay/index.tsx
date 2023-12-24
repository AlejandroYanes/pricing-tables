import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';

interface Props {
  delay: number;
  children: ReactNode;
}

const RenderWithDelay = (props: Props) => {
  const { delay, children } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return show
    ? <>{children}</>
    : null;
};

export default RenderWithDelay;
