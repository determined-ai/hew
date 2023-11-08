import React, { CSSProperties, ReactNode } from 'react';

import css from './Row.module.scss';

interface RowProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  wrap?: boolean;
  height?: number;
}

export const Row: React.FC<RowProps> = ({ children, gap = 8, wrap, height }: RowProps) => {
  const classes = [css.row];
  if (wrap) classes.push(css.wrap);

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--row-gap': gap + 'px',
          '--row-height': height ? height + 'px' : '',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};

export default Row;
