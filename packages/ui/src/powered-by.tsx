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
        'red': 'bg-red-600 dark:bg-red-600',
        'orange': 'bg-orange-600 dark:bg-orange-600',
        'amber': 'bg-amber-600 dark:bg-amber-600',
        'yellow': 'bg-yellow-600 dark:bg-yellow-600',
        'lime': 'bg-lime-600 dark:bg-lime-600',
        'green': 'bg-green-600 dark:bg-green-600',
        'emerald': 'bg-emerald-600 dark:bg-emerald-600',
        'teal': 'bg-teal-600 dark:bg-teal-600',
        'cyan': 'bg-cyan-600 dark:bg-cyan-600',
        'sky': 'bg-sky-600 dark:bg-sky-600',
        'blue': 'bg-blue-600 dark:bg-blue-600',
        'indigo': 'bg-indigo-600 dark:bg-indigo-600',
        'violet': 'bg-violet-600 dark:bg-violet-600',
        'purple': 'bg-purple-600 dark:bg-purple-600',
        'fuchsia': 'bg-fuchsia-600 dark:bg-fuchsia-600',
        'pink': 'bg-pink-600 dark:bg-pink-600',
        'rose': 'bg-rose-600 dark:bg-rose-600',
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
