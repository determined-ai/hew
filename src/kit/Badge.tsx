import React, { CSSProperties, useMemo, useRef } from 'react';

import { hsl2str, HslColor, str2hsl } from 'kit/internal/functions';
import { getCssVar } from 'kit/Theme';

import css from './Badge.module.scss';
import { useTheme } from './internal/Theme/theme';

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
  ...props
}: BadgeProps) => {
  const ref = useRef(null);
  const { themeSettings: { themeIsDark } } = useTheme();
  const bgColor = !!props.backgroundColor ? props.backgroundColor : str2hsl(getCssVar(ref, 'var(--theme-surface)'))

  const { classes, style } = useMemo(() => {
    const classes = [css.base];

    const style: CSSProperties = {
      backgroundColor: hsl2str(bgColor),
      border: bgColor.l < 15 ? '1px solid #646464' : '',
      color: bgColor.l > 70 ? fontColorDark : fontColorLight,
    };
    if (dashed) classes.push(css.dashed);
    const isDark = themeIsDark
    style.backgroundColor = hsl2str({
      ...bgColor,
      s: bgColor.s > 0 ? (isDark ? 70 : 50) : 0,
    });

    return { classes, style };
  }, [dashed, bgColor, themeIsDark]);

  return (
    // Need this wrapper for tooltip to apply
    <span {...props} ref={ref}>
      <span className={classes.join(' ')} style={style}>
        {text}
      </span>
    </span>
  );
};

export default Badge;
