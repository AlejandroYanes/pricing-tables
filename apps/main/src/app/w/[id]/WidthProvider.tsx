'use client';
import { type ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
}

const WidthProvider = ({ children }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const parentWindow = window.top;
    if (!wrapper || !parentWindow) return;
    const { width, height } = wrapper.getBoundingClientRect();
    console.log('sending size', wrapper.getBoundingClientRect());
    parentWindow.postMessage({ source: 'pricing-widget__size', width, height }, '*');
  }, []);

  return (
    <div id="pricing-widget__wrapper" className="flex items-center justify-center">
      <div id="pricing-widget__content" ref={wrapperRef}>
        {children}
      </div>
    </div>
  );
}

export default WidthProvider;
