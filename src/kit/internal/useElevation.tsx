import React, { createContext, CSSProperties, useContext } from 'react';

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
  const ElevationContext = useElevation();
  let currentElevation = useContext(ElevationContext);
  if (elevationOverride !== undefined) currentElevation = elevationOverride;
  const elevationClasses = [css.zero, css.one, css.two, css.three, css.four];

  const classes = [themeClass, className, css.base, elevationClasses[currentElevation]];
  if (hover) classes.push(css.hover);
  if (border) classes.push(css.border);
  return (
    <div
      className={classes.join(' ')}
      style={{ '--current-elevation': currentElevation } as CSSProperties}
      {...props}>
      <ElevationContext.Provider value={Math.min(currentElevation + 1, 4) as ElevationLevels}>
        {children}
      </ElevationContext.Provider>
    </div>
  );
};

const useElevation = (): React.Context<ElevationLevels> => {
  const ElevationContext = createContext<ElevationLevels>(0);

  // const currentElevation = useContext(ElevationContext);
  // <div className={someCssStuff(currentElevation)}>
  //   <ElevationContext.Provider value={currentElevation + 1}>{children}</ElevationContext.Provider>
  // </div>;

  return ElevationContext;
};

export default useElevation;
