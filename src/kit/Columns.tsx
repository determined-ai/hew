import React, { CSSProperties, ReactNode } from 'react';

import { useTheme } from 'kit/internal/Theme/theme';

import css from './Columns.module.scss';

interface ColumnProps {
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface ColumnsProps {
  children?: ReactNode;
  gap?: 0 | 8 | 16;
  page?: boolean;
}

const ColumnComponent: React.FC<ColumnProps> = ({ children, align = 'left' }: ColumnProps) => {
  const { themeSettings: { className: themeClass } } = useTheme();
  const classes = [`${css[align]} ${css.column}`, themeClass];
  return <div className={classes.join(' ')}>{children}</div>;
};

const ColumnsComponent: React.FC<ColumnsProps> = ({ children, gap = 8, page }: ColumnsProps) => {
  const { themeSettings: { className: themeClass } } = useTheme();
  const classes = [css.columns, themeClass];
  if (page) classes.push(css.page);

  return (
    <div
      className={classes.join(' ')}
      style={
        {
          '--columns-gap': gap + 'px',
        } as CSSProperties
      }>
      {children}
    </div>
  );
};

export const Column = ColumnComponent;
export const Columns = ColumnsComponent;
