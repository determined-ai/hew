import React, { Children } from 'react';

import { ShirtSize, useTheme } from 'kit/Theme';
import { ValueOf } from 'kit/utils/types';

import css from './Collection.module.scss';

export const LayoutMode = {
  AutoFill: 'auto-fill', // will squeeze as many items into a given space and minimum size
  AutoFit: 'auto-fit', // auto-fill but also stretch to fit the entire available space.
  ScrollableRow: 'scrollableRow',
} as const;

export type LayoutMode = ValueOf<typeof LayoutMode>;

interface Props {
  children: React.ReactNode;
  gap?: ShirtSize;
  minItemWidth?: number;
  mode?: LayoutMode;
}

const sizeMap = {
  [ShirtSize.Small]: '4px',
  [ShirtSize.Medium]: '8px',
  [ShirtSize.Large]: '16px',
};

const Collection: React.FC<Props> = ({
  gap = ShirtSize.Medium,
  minItemWidth = 240,
  mode = LayoutMode.AutoFit,
  children,
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const count = Children.toArray(children).length;
  const style = {
    gridGap: sizeMap[gap],
    gridTemplateColumns: '',
  };
  const classes = [css.base, themeClass];

  if (mode === LayoutMode.AutoFill || LayoutMode.AutoFit) {
    style.gridTemplateColumns = `repeat(${mode}, minmax(${minItemWidth}px, 1fr))`;
  }
  if (mode === LayoutMode.ScrollableRow) {
    classes.push(css.row);
    style.gridTemplateColumns = `repeat(${count}, ${minItemWidth}px)`;
  }
  return (
    <div className={classes.join(' ')} style={style}>
      {children}
    </div>
  );
};

export default Collection;
