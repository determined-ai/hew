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
  const elevationClasses = [css.ezero, css.eone, css.etwo, css.ethree, css.efour];

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

/* For basic implementation wrap your component in ElevationWrapper. Surface is the simplest example.
 * If you need to do something more complicated it will require some SCSS work.
 * In your component enter the following:
 *
 * const currentElevation = useContext(ElevationContext);
 * const elevationClasses = [css.zero, css.one, css.two, css.three, css.four];
 *
 * and then add `elevationClasses[currentElevation]` to your list of classes.
 * At the top of your <component>.module.scss file put the line:
 *
 * @use 'internal/Elevation.module.scss' as e;
 *
 * Then create the classes mentioned above like so:
 *
 * &.zero {
 *   <selector that needs elevation> {
 *     @include e.elevation(0);
 *   }
 * }
 *
 * And so on. For an example, look at the Pivot component.
 */

export const ElevationContext = createContext<ElevationLevels>(1);
