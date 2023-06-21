'use client'

import React from 'react';
import type { ReactNode } from 'react';
import { createStyles } from '@mantine/core';

interface Props {
  children: ReactNode;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  height?: string | number;
  width?: string | number;
}

const useStyles = createStyles((theme, { top, left, bottom, right, height, width }: Omit<Props, 'children'>) => ({
  root: {
    position: 'absolute',
    top: typeof top === 'number' ? `${top}px` : top,
    right: typeof right === 'number' ? `${right}px` : right,
    bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
    left: typeof left === 'number' ? `${left}px` : left,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }
}));

export function AbsoluteContent(props: Props) {
  const { children, ...styleProps } = props;
  const { classes } = useStyles(styleProps);

  return (
    <div data-el="absolute-content" className={classes.root}>
      {children}
    </div>
  );
}

