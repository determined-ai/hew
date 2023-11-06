import React from 'react';

import { TypographySize } from 'kit/internal/fonts';
import { useTheme } from 'kit/internal/Theme/theme';

import css from './Typography.module.scss';
interface Props {
  size?: TypographySize;
}

const Header: React.FC<React.PropsWithChildren<Props>> = ({ children, size }) => {
  const {
    themeSettings: { className: themeClass },
  } = useTheme();
  const getThemeClass = () => {
    if (!size) return '';

    if (size === TypographySize.XL) return css.headerXL;
    if (size === TypographySize.L) return css.headerL;
    if (size === TypographySize.default) return css.headerDefault;
    if (size === TypographySize.S) return css.headerS;

    return css.headerXS;
  };

  const classes = [css.header, getThemeClass(), themeClass];

  return <h1 className={classes.join(' ')}>{children}</h1>;
};

export default Header;
