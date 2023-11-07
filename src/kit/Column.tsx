import { isNumber } from 'lodash';
import React, { CSSProperties, ReactNode } from 'react';

import css from './Column.module.scss';

interface ColumnProps {
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: 'hug' | 'fill' | number;
  gap?: 0 | 8 | 16;
}

const Column: React.FC<ColumnProps> = ({
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

export default Column;
