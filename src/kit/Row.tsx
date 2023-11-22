import React, { CSSProperties, ReactNode } from 'react';

import { isNumber } from 'kit/internal/functions';
import { useTheme } from 'kit/Theme';

import css from './Row.module.scss';

interface RowProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  wrap?: boolean;
  height?: number;
  align?: 'top' | 'center' | 'bottom';
  width?: 'fill' | number;
  horizontalPadding?: 0 | 8 | 16;
  justifyContent?: CSSProperties['justifyContent'];
}

export const Row: React.FC<RowProps> = ({
  justifyContent,
  width,
  horizontalPadding = 0,
  align,
  children,
  gap = 8,
  wrap,
  height,
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
      style={{
        gap: gap + 'px',
        height: height ? height + 'px' : 'auto',
        justifyContent: justifyContent ?? 'normal',
        padding: `0 ${horizontalPadding}px`,
        width: w,
      }}>
      {children}
    </div>
  );
};

export default Row;
