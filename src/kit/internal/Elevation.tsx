import React, { createContext, useContext } from 'react';

import { ElevationLevels, useTheme } from 'kit/Theme';

import css from './Elevation.module.scss';

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  border?: boolean;
  hover?: boolean;
  elevationOverride?: ElevationLevels;
}

export const ElevationWrapper: React.FC<Props> = ({
  border = false,
  children,
  className,
  elevationOverride,
  hover = false,
  ...props
}: Props) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  let currentElevation = useContext(ElevationContext);
  if (elevationOverride !== undefined) currentElevation = elevationOverride;
  const elevationClasses = [css.zero, css.one, css.two, css.three, css.four];

  const classes = [themeClass, className, css.base, elevationClasses[currentElevation]];
  if (hover) classes.push(css.hover);
  if (border) classes.push(css.border);
  return (
    <div className={classes.join(' ')} {...props}>
      <ElevationContext.Provider value={Math.min(currentElevation + 1, 4) as ElevationLevels}>
        {children}
      </ElevationContext.Provider>
    </div>
  );
};

export const ElevationContext = createContext<ElevationLevels>(1);
