import React, { Children, CSSProperties } from 'react';

import { ShirtSize, Spacing, useTheme } from 'kit/Theme';
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
  [ShirtSize.Small]: Spacing.Xs,
  [ShirtSize.Medium]: Spacing.Md,
  [ShirtSize.Large]: Spacing.Xl,
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
  const style: CSSProperties = {
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
