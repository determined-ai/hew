/* eslint-disable sort-keys-fix/sort-keys-fix */

import React, { useContext } from 'react';
import { ValueOf } from 'kit/utils/types';
import { Theme } from 'kit/Theme/themes';
export type Mode = ValueOf<typeof Mode>;

export const Mode = {
  System: 'system',
  Light: 'light',
  Dark: 'dark',
} as const;

export const MATCH_MEDIA_SCHEME_DARK = '(prefers-color-scheme: dark)';
export const MATCH_MEDIA_SCHEME_LIGHT = '(prefers-color-scheme: light)';

interface ThemeState {
  themeIsDark: boolean;
  theme: Theme;
}

export const ThemeContext = React.createContext<ThemeState | undefined>(undefined);

export const useThemeState = (): { themeState: ThemeState } => {
  /**
   * Some UI Kit components such as the CodeEditor do not inherit the theme from css or page styling
   * and instead require us to set a theme related prop dynamically. This context allows us to
   * subscribe to UIProvider theme updates and re-render these child components with the correct
   * theme.
   */
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useStore(UI) must be used within a UIProvider');
  }

  return { themeState: context };
};

export const themeLight = {
  // Area and surface styles.
  background: 'rgba(240, 240, 240, 1.0)',
  backgroundBorder: undefined,
  backgroundOn: 'rgba(18, 18, 18, 1.0)',

  // Color schemes
  colorScheme: 'light',
  elevation: '0px 6px 12px rgba(0, 0, 0, 0.12)',
  elevationStrong: '0px 12px 24px rgba(0, 0, 0, 0.12)',
  elevationWeak: '0px 2px 4px rgba(0, 0, 0, 0.24)',
  float: 'rgba(255, 255, 255, 1.0)',
  floatBorder: 'rgba(225, 225, 225, 1.0)',
  floatOn: 'rgba(49, 49, 49, 1.0)',

  // Interactive styles.
  ix: 'rgba(255, 255, 255, 1.0)',
  ixActive: 'rgba(231, 247, 255, 1.0)',
  ixBorder: 'rgba(217, 217, 217, 1.0)',
  ixBorderActive: 'rgba(0, 155, 222, 1.0)',
  ixBorderInactive: 'rgba(217, 217, 217, 1.0)',
  ixCancel: 'rgba(89,89,89,1)',
  ixInactive: 'rgba(245, 245, 245, 1.0)',
  ixOn: 'rgba(38, 38, 38, 1.0)',
  ixOnActive: 'rgba(0, 155, 222, 1.0)',
  ixOnInactive: 'rgba(217, 217, 217, 1.0)',

  // Specialized and unique styles.
  overlay: 'rgba(255, 255, 255, 0.75)',
  overlayStrong: 'rgba(255, 255, 255, 1.0)',
  overlayWeak: 'rgba(255, 255, 255, 0.5)',
  stage: 'rgba(246, 246, 246, 1.0)',
  stageBorder: 'rgba(194, 194, 194, 1.0)',
  stageOn: 'rgba(69, 69, 69, 1.0)',

  // Palette colors for strong/weak calculations.
  strong: 'rgba(0, 0, 0, 1.0)',
  surface: 'rgba(250, 250, 250, 1.0)',
  surfaceBorder: 'rgba(212, 212, 212, 1.0)',
  surfaceOn: 'rgba(0, 8, 16, 1.0)',
  weak: 'rgba(255, 255, 255, 1.0)',
};

export const themeDark = {
  // Area and surface styles.
  background: 'rgba(21, 21, 23, 1.0)',
  backgroundBorder: undefined,
  backgroundOn: 'rgba(237, 237, 237, 1.0)',

  // Color schemes
  colorScheme: 'dark',
  elevation: '0px 6px 12px rgba(255, 255, 255, 0.06)',
  elevationStrong: '0px 12px 24px rgba(255, 255, 255, 0.06)',
  elevationWeak: '0px 2px 4px rgba(255, 255, 255, 0.12)',
  float: 'rgba(60, 61, 62, 1.0)',
  floatBorder: 'rgba(90, 91, 92, 1.0)',
  floatOn: 'rgba(206, 206, 206, 1.0)',

  // Interactive styles.
  ix: 'rgba(21, 21, 23, 1.0)',
  ixActive: 'rgba(17, 27, 38, 1.0)',
  ixBorder: 'rgba(67, 67, 67, 1.0)',
  ixBorderActive: 'rgba(23, 125, 220, 1.0)',
  ixBorderInactive: 'rgba(80, 80, 80, 1.0)',
  ixCancel: 'rgba(115,115,115,1)',
  ixInactive: 'rgba(49, 49, 49, 1.0)',
  ixOn: 'rgba(209, 209, 209, 1.0)',
  ixOnActive: 'rgba(23, 125, 220, 1.0)',
  ixOnInactive: 'rgba(80, 80, 80, 1.0)',

  // Specialized and unique styles.
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayStrong: 'rgba(0, 0, 0, 1.0)',
  overlayWeak: 'rgba(0, 0, 0, 0.5)',
  stage: 'rgba(35, 36, 38, 1.0)',
  stageBorder: 'rgba(61, 61, 61, 1.0)',
  stageOn: 'rgba(186, 186, 186, 1.0)',

  // Palette colors for strong/weak calculations.
  strong: 'rgba(255, 255, 255, 1.0)',
  surface: 'rgba(48, 49, 50, 1.0)',
  surfaceBorder: 'rgba(85, 85, 85, 1.0)',
  surfaceOn: 'rgba(255, 247, 239, 1.0)',
  weak: 'rgba(0, 0, 0, 1.0)',
};

export const getSystemMode = (): Mode => {
  const isDark = matchMedia?.(MATCH_MEDIA_SCHEME_DARK).matches;
  if (isDark) return Mode.Dark;

  const isLight = matchMedia?.(MATCH_MEDIA_SCHEME_LIGHT).matches;
  if (isLight) return Mode.Light;

  return Mode.System;
};
