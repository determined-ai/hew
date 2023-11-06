import { isNumber } from 'lodash';
import React, { CSSProperties, ReactNode } from 'react';

import css from './Columns.module.scss';

interface ColumnProps {
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: 'hug' | 'fill' | number;
  gap?: 0 | 8 | 16;
}

interface ColumnsProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  wrap?: boolean;
  height?: number;
  marginBottom?: 0 | 8 | 16;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  gap = 0,
  align = 'left',
  width = 'fill',
}: ColumnProps) => {
  const classes = [css.column, css[`align-${align}`]];

  let flex = '';
  if (width && isNumber(width)) {
    flex = `0 0 ${width}px`;
  } else if (width === 'hug') {
    flex = '0 0 fit-content';
  } else if (width === 'fill') {
    flex = '1 0 fit-content';
  }

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--column-flex': flex,
          '--column-gap': gap + 'px',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};

export const Columns: React.FC<ColumnsProps> = ({
  children,
  gap = 8,
  wrap,
  marginBottom,
  height,
}: ColumnsProps) => {
  const classes = [css.columns];
  if (wrap) classes.push(css.wrap);

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--columns-gap': gap + 'px',
          '--columns-height': height ? height + 'px' : '',
          '--columns-margin-bottom': marginBottom ? marginBottom + 'px' : '',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};
