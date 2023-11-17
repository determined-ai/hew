import React, { CSSProperties, ReactNode } from 'react';

import { useTheme } from 'kit/Theme';

import { isNumber } from './internal/functions';
import css from './Row.module.scss';

interface RowProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  wrap?: boolean;
  height?: number;
  align?: 'start' | 'center' | 'end';
  width?: 'hug' | 'fill' | number;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = 8,
  wrap,
  height,
  align = 'center',
  width,
}: RowProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();

  const classes = [css.row, css[`align-${align}`], themeClass];
  if (wrap) classes.push(css.wrap);

  let w = 'auto';
  if (width && isNumber(width)) {
    w = `${width}px`;
  } else if (width === 'fill') {
    w = '100%';
  }

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--row-gap': gap + 'px',
          '--row-height': height ? height + 'px' : '',
          'width': w,
        } as CSSProperties
      }>
      {children}
    </div>
  );
};

export default Row;
