import React from 'react';

import { useTheme } from 'kit/Theme';

import css from './Surface.module.scss';
import { Elevation } from './Theme';
interface Props {
  children?: React.ReactNode;
  elevationOverride?: Elevation;
  hover?: boolean;
}

const Surface: React.FC<Props> = ({ children, elevationOverride, hover }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];

  if (hover) classes.push(css.hover);
  const overrideClasses = [css.zero, css.one, css.two, css.three, css.four];
  if (elevationOverride !== undefined) classes.push(overrideClasses[elevationOverride]);

  return <div className={classes.join(' ')}>{children}</div>;
};

export default Surface;
