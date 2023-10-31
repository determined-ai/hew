import React from 'react';

import css from './Surface.module.scss';
import { Elevation } from './Theme';

interface Props {
  children?: React.ReactNode;
  elevationOverride?: Elevation;
  hover?: boolean;
}

const Surface: React.FC<Props> = ({ children, elevationOverride, hover }: Props) => {
  const classes = [css.base];

  if (hover) classes.push(css.hover);
  const overrideClasses = [css.zero, css.one, css.two, css.three, css.four];
  if (elevationOverride) classes.push(overrideClasses[elevationOverride]);

  return <div className={classes.join(' ')}>{children}</div>;
};

export default Surface;
