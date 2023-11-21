import React, { createContext, useContext, useMemo } from 'react';

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
  const { elevationClass, nextElevation } = useElevation({
    elevationOverride,
  });

  const classes = [themeClass, className, css.elevationBase, elevationClass];
  if (hover) classes.push(css.hover);
  if (border) classes.push(css.border);
  return (
    <div className={classes.join(' ')} {...props}>
      <ElevationContext.Provider value={nextElevation}>{children}</ElevationContext.Provider>
    </div>
  );
};

export const ElevationContext = createContext<ElevationLevels>(1);

interface ElevationProps {
  elevationOverride?: ElevationLevels;
}
interface ElevationHook {
  currentElevation: ElevationLevels;
  elevationClass: string;
  nextElevation: ElevationLevels;
}

export const useElevation = ({ elevationOverride }: ElevationProps = {}): ElevationHook => {
  let currentElevation = useContext(ElevationContext);
  if (elevationOverride !== undefined) currentElevation = elevationOverride;

  return useMemo(
    () => ({
      currentElevation,
      elevationClass: css[`elevation-${currentElevation}`],
      nextElevation: Math.min(currentElevation + 1, 4) as ElevationLevels,
    }),
    [currentElevation],
  );
};

/* For basic implementation wrap your component in ElevationWrapper. Surface is the simplest example.
 * If you need to do something more complicated it will require a little more work.
 * In your component enter the following:
 *
 * const { elevationClass, nextElevation } = useElevation();
 *
 * and then add elevationClass to your list of classes. Next, surround the section of
 * your component using elevation with the following:
 *
 * <ElevationContext.Provider value={nextElevation}>
 *    <component>
 * </ElevationContext.Provider>
 *
 * At the top of your <component>.module.scss file put the line:
 *
 * @use 'internal/Elevation.module.scss' as e;
 *
 * Finally, at the selectors that need elevation applied add `@include e.elevation`.
 * For an example, look at the Pivot component.
 */
