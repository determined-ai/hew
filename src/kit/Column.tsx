import { isNumber } from 'lodash';
import React, { ReactNode } from 'react';

import { useTheme } from 'kit/Theme';

import css from './Column.module.scss';

interface ColumnProps {
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: 'hug' | 'fill' | number;
  gap?: 0 | 8 | 16;
  hideInMobile?: boolean;
}

const Column: React.FC<ColumnProps> = ({
  children,
  gap = 8,
  align = 'left',
  width = 'fill',
  hideInMobile,
}: ColumnProps) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.column, css[`align-${align}`], themeClass];
  if (hideInMobile) {
    classes.push(css.hideInMobile);
  }

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
      style={{
        flex: flex,
        gap: gap + 'px',
      }}>
      {children}
    </div>
  );
};

export default Column;
