'use client';
import { type ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
}

const WidthProvider = ({ children }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const element = entries[0];
      const parentWindow = window.top;

      if (!element || !parentWindow) return;

      const { width, height } = element.contentRect;
      console.log('sending size', width, height);
      parentWindow.postMessage({ source: 'pricing-widget__size', width, height }, '*');
    });
    resizeObserver.current.observe(wrapperRef.current!);
    // const wrapper = wrapperRef.current;
    // const parentWindow = window.top;
    // if (!wrapper || !parentWindow) return;
    // const { width, height } = wrapper.getBoundingClientRect();
    // console.log('sending size', wrapper.getBoundingClientRect());
    // parentWindow.postMessage({ source: 'pricing-widget__size', width, height }, '*');
  }, []);

  return (
    <div id="pricing-widget__wrapper" ref={wrapperRef}>
      {children}
    </div>
  );
}

export default WidthProvider;
