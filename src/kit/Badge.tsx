import React, { CSSProperties, useMemo } from 'react';

import { hsl2str, HslColor, str2hsl } from 'kit/internal/functions';
import { useTheme } from 'kit/Theme';

import css from './Badge.module.scss';

export interface BadgeProps {
  text: string;
  backgroundColor?: HslColor;
  dashed?: boolean;
}

const fontColorLight = '#FFFFFF';
const fontColorDark = '#000810';

const Badge: React.FC<BadgeProps> = ({
  text,
  dashed = false,
  backgroundColor,
  ...props
}: BadgeProps) => {
  const {
    themeSettings: { themeIsDark, className: themeClass },
    getThemeVar,
  } = useTheme();

  const bgColor = backgroundColor ? backgroundColor : str2hsl(getThemeVar('surface'));

  const { classes, style } = useMemo(() => {
    const classes = [css.base, themeClass];

    const style: CSSProperties = {
      backgroundColor: hsl2str(bgColor),
      border: bgColor.l < 15 ? '1px solid #646464' : '',
      color: bgColor.l > 70 ? fontColorDark : fontColorLight,
    };
    if (dashed) classes.push(css.dashed);
    const isDark = themeIsDark;
    style.backgroundColor = hsl2str({
      ...bgColor,
      s: bgColor.s > 0 ? (isDark ? 70 : 50) : 0,
    });

    return { classes, style };
  }, [dashed, bgColor, themeClass, themeIsDark]);

  return (
    // Need this wrapper for tooltip to apply
    <span {...props}>
      <span className={classes.join(' ')} style={style}>
        {text}
      </span>
    </span>
  );
};

export default Badge;
