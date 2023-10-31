import React, { useMemo } from 'react';

import { Elevation } from './Elevation';
import css from './Surface.module.scss';
import useUI, { DarkLight } from './Theme';

interface Props {
  children?: React.ReactNode;
  elevationOverride?: Elevation;
  hover?: boolean;
}

const Surface: React.FC<Props> = ({ children, elevationOverride, hover }: Props) => {
  const { ui } = useUI();
  const classes = [css.base];
  const theme = useMemo(
    () => (ui.darkLight === DarkLight.Dark ? css.dark : css.light),
    [ui.darkLight],
  );

  if (hover) classes.push(css.hover);
  const overrideClasses = [css.zero, css.one, css.two, css.three, css.four];
  if (elevationOverride) classes.push(overrideClasses[elevationOverride]);

  return <div className={[...classes, theme].join(' ')}>{children}</div>;
};

export default Surface;
