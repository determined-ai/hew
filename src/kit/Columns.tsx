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
  justification?: 'space' | 'left' | 'right' | 'center';
}

export const Column: React.FC<ColumnProps> = ({
  children,
  gap,
  align = 'left',
  width = 'fill',
}: ColumnProps) => {
  const classes = [
    css.column,
    css[align],
  ];

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
      }>{children}
    </div>
  );
};

export const Columns: React.FC<ColumnsProps> = ({
  justification,
  children,
  gap = 8,
  wrap,
  height }: ColumnsProps) => {
  const classes = [css.columns];
  if (wrap) classes.push(css.wrap);
  if (justification) classes.push(css[justification]);

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--columns-gap': gap + 'px',
          '--columns-height': height + 'px',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};
