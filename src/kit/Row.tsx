import React, { CSSProperties, ReactNode } from 'react';

import css from './Row.module.scss';

interface RowProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  wrap?: boolean;
  height?: number;
  marginBottom?: 0 | 8 | 16;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = 8,
  wrap,
  marginBottom,
  height,
}: RowProps) => {
  const classes = [css.row];
  if (wrap) classes.push(css.wrap);

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--row-gap': gap + 'px',
          '--row-height': height ? height + 'px' : '',
          '--row-margin-bottom': marginBottom ? marginBottom + 'px' : '',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};

export default Row;
