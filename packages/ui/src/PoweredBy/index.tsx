import type { CSSProperties } from 'react';
import { createStyles, Anchor } from '@mantine/core';

import { LetterLogo } from '../Logo';

interface Props {
  color: string;
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

const useStyles = createStyles((theme, props: Omit<Props, 'className' | 'style' | 'position'>) => {
  const { color, top, right, bottom, left, width, height } = props;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
      padding: '4px 8px',
      backgroundColor: theme.colors[color]![6],
      fontSize: theme.fontSizes.xs,
      position: 'absolute',
      top: typeof top === 'number' ? `${top}px` : top,
      right: typeof right === 'number' ? `${right}px` : right,
      bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
      left: typeof left === 'number' ? `${left}px` : left,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    },
    left: {
      transformOrigin: 'left top',
      transform: 'rotate(-90deg)',
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
    right: {
      transformOrigin: 'right top',
      transform: 'rotate(90deg)',
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
    top: {
      borderTopLeftRadius: theme.radius.sm,
      borderTopRightRadius: theme.radius.sm,
    },
    bottom: {
      borderBottomLeftRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
    },
  }
});

export function PoweredBy(props: Props) {
  const { position, className, style } = props;
  const { classes, cx } = useStyles(props);
  return (
    <Anchor href="https://www.dealo.app">
      <div className={cx(classes.root, (classes as any)[position || 'left'], className)} style={style}>
        Powered by <LetterLogo white height={16} width={16} style={{ marginLeft: '4px' }} /><strong>ealo</strong>
      </div>
    </Anchor>
  );
}
