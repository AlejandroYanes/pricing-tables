'use client'

import type { CSSProperties } from 'react';
import { cva } from 'class-variance-authority';
import type { Colors } from '@dealo/helpers';

import { cn } from './helpers';
import { LetterLogo } from './Logo';

interface Props {
  color: Colors;
  position?: 'left' | 'right' | 'top' | 'bottom';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  height?: string | number;
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

const variants = cva(
  'absolute flex items-center text-white py-1 px-2',
  {
    variants: {
      position: {
        left: 'origin-top-left rotate-[-90deg] rounded-tl-sm rounded-tr-sm',
        right: 'origin-top-right rotate-[90deg] rounded-tr-sm rounded-tr-sm',
        top: 'rounded-tl-sm rounded-tr-sm',
        bottom: 'rounded-bl-sm rounded-br-sm',
      },
      color: {
        'red': 'bg-red-500 dark:bg-red-500',
        'orange': 'bg-orange-500 dark:bg-orange-500',
        'amber': 'bg-amber-500 dark:bg-amber-500',
        'yellow': 'bg-yellow-500 dark:bg-yellow-500',
        'lime': 'bg-lime-500 dark:bg-lime-500',
        'green': 'bg-green-500 dark:bg-green-500',
        'emerald': 'bg-emerald-500 dark:bg-emerald-500',
        'teal': 'bg-teal-500 dark:bg-teal-500',
        'cyan': 'bg-cyan-500 dark:bg-cyan-500',
        'sky': 'bg-sky-500 dark:bg-sky-500',
        'blue': 'bg-blue-500 dark:bg-blue-500',
        'indigo': 'bg-indigo-500 dark:bg-indigo-500',
        'violet': 'bg-violet-500 dark:bg-violet-500',
        'purple': 'bg-purple-500 dark:bg-purple-500',
        'fuchsia': 'bg-fuchsia-500 dark:bg-fuchsia-500',
        'pink': 'bg-pink-500 dark:bg-pink-500',
        'rose': 'bg-rose-500 dark:bg-rose-500',
      },
    },
  }
);

export function PoweredBy(props: Props) {
  const { position, color, className, style } = props;

  return (
    <a href="https://www.dealo.app">
      <div className={cn(variants({ position, color }), className)} style={style}>
        Powered by <LetterLogo white height={16} width={16} style={{ marginLeft: '4px' }} /><strong>ealo</strong>
      </div>
    </a>
  );
}
