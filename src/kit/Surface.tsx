import React from 'react';

import { ElevationWrapper } from 'kit/internal/useElevation';
import { ElevationLevels, useTheme } from 'kit/Theme';

import css from './Surface.module.scss';
interface Props {
  children?: React.ReactNode;
  elevationOverride?: ElevationLevels;
  hover?: boolean;
}

const Surface: React.FC<Props> = ({ children, elevationOverride, hover }: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const classes = [css.base, themeClass];

  return (
    <ElevationWrapper
      border={true}
      className={classes.join(' ')}
      elevationOverride={elevationOverride}
      hover={hover}>
      {children}
    </ElevationWrapper>
  );
};

export default Surface;
