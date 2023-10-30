import React, { useMemo } from 'react';

import css from './Surface.module.scss';
import useUI, { DarkLight } from './Theme';

interface Props {
  children?: React.ReactNode;
  elevationOverride?: 0 | 1 | 2 | 3 | 4;
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
  switch (elevationOverride) {
    case 0:
      classes.push(css.zero);
      break;
    case 1:
      classes.push(css.one);
      break;
    case 2:
      classes.push(css.two);
      break;
    case 3:
      classes.push(css.three);
      break;
    case 4:
      classes.push(css.four);
      break;
    default:
      break;
  }

  return <div className={[...classes, theme].join(' ')}>{children}</div>;
};

export default Surface;
