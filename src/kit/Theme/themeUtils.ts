/* eslint-disable sort-keys-fix/sort-keys-fix */
import { RefObject } from 'react';

import { findParentByClass } from 'kit/internal/functions';

export const themeBase = {
  // Area and surface styles.
  background: undefined,
  backgroundBorder: undefined,
  backgroundBorderStrong: undefined,
  backgroundBorderWeak: undefined,
  backgroundOn: undefined,
  backgroundOnStrong: undefined,
  backgroundOnWeak: undefined,
  backgroundStrong: undefined,
  backgroundWeak: undefined,

  // Brand colors.
  brand: 'rgba(247, 123, 33, 1.0)',
  brandStrong: undefined,
  brandWeak: undefined,

  // Color schemes
  colorScheme: 'normal',
  float: undefined,
  floatBorder: undefined,
  floatBorderStrong: undefined,
  floatBorderWeak: undefined,
  floatOn: undefined,
  floatOnStrong: undefined,
  floatOnWeak: undefined,
  floatStrong: undefined,
  floatWeak: undefined,

  // Font styles.
  fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  fontFamilyCode: '"Source Code Pro", monospace',

  // Specialized and unique styles.
  density: '2',
  fontFamilyVar: '"Inter var", Arial, Helvetica, sans-serif',
  borderRadius: '4px',

  // Interactive styles.
  ix: undefined,
  borderRadiusStrong: '8px',
  ixActive: undefined,
  borderRadiusWeak: '2px',
  ixBorder: undefined,
  elevation: undefined,
  ixBorderActive: undefined,
  elevationStrong: undefined,
  stage: undefined,
  elevationWeak: undefined,
  stageBorder: undefined,
  ixBorderInactive: undefined,
  stageBorderStrong: undefined,
  ixBorderStrong: undefined,
  stageBorderWeak: undefined,
  ixBorderWeak: undefined,

  // Palette colors for strong/weak calculations.
  strong: undefined,
  ixInactive: undefined,
  weak: undefined,
  ixOn: undefined,
  stageOn: undefined,
  ixOnActive: undefined,
  stageOnStrong: undefined,
  ixOnInactive: undefined,
  stageOnWeak: undefined,
  ixOnStrong: undefined,
  stageStrong: undefined,
  ixOnWeak: undefined,
  stageWeak: undefined,
  ixStrong: undefined,
  surface: undefined,
  ixWeak: undefined,
  surfaceBorder: undefined,
  overlay: undefined,
  surfaceBorderStrong: undefined,
  overlayStrong: undefined,
  surfaceOn: undefined,
  overlayWeak: undefined,
  surfaceOnStrong: undefined,

  // Status styles.
  statusActive: 'rgba(0, 155, 222, 1.0)',
  surfaceStrong: undefined,
  statusActiveOn: 'rgba(255, 255, 255, 1.0)',
  surfaceWeak: undefined,
  statusActiveOnStrong: undefined,
  statusActiveOnWeak: undefined,
  surfaceOnWeak: undefined,
  statusActiveStrong: undefined,
  statusActiveWeak: undefined,
  surfaceBorderWeak: undefined,
  statusCritical: 'rgba(204, 0, 0, 1.0)',
  statusCriticalOn: 'rgba(255, 255, 255, 1.0)',
  statusCriticalOnStrong: undefined,
  statusCriticalOnWeak: undefined,
  statusCriticalStrong: undefined,
  statusCriticalWeak: undefined,
  statusError: 'rgb(247, 140, 140)',
  statusInactive: 'rgba(102, 102, 102, 1.0)',
  statusInactiveOn: 'rgba(255, 255, 255, 1.0)',
  statusInactiveOnStrong: undefined,
  statusInactiveOnWeak: undefined,
  statusInactiveStrong: undefined,
  statusInactiveWeak: undefined,
  statusPending: 'rgba(102, 102, 204, 1.0)',
  statusPendingOn: 'rgba(255, 255, 255, 1.0)',
  statusPendingOnStrong: undefined,
  statusPendingOnWeak: undefined,
  statusPendingStrong: undefined,
  statusPendingWeak: undefined,
  statusPotential: 'rgba(255, 255, 255, 0)',
  statusSuccess: 'rgba(0, 153, 0, 1.0)',
  statusSuccessOn: 'rgba(255, 255, 255, 1.0)',
  statusSuccessOnStrong: undefined,
  statusSuccessOnWeak: undefined,
  statusSuccessStrong: undefined,
  targetFocus: '0px 0px 4px rgba(0, 155, 222, 0.12)',
  statusSuccessWeak: undefined,
  strokeWidth: '1px',
  statusWarning: 'rgba(204, 153, 0, 1.0)',
  strokeWidthStrong: '3px',
  statusWarningOn: 'rgba(255, 255, 255, 1.0)',
  strokeWidthWeak: '0.5px',
  statusWarningOnStrong: undefined,
  statusWarningOnWeak: undefined,
  statusWarningStrong: undefined,
  statusWarningWeak: undefined,
};

export type Theme = Record<keyof typeof themeBase, string>;

export const globalCssVars = {
  animationCurve: '0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  iconBig: '28px',
  iconEnormous: '40px',
  iconGiant: '44px',
  iconGreat: '32px',
  iconHuge: '36px',
  iconJumbo: '48px',
  iconLarge: '24px',
  iconMedium: '20px',
  iconMega: '52px',
  iconSmall: '16px',
  iconTiny: '12px',

  navBottomBarHeight: '56px',
  navSideBarWidthMax: '240px',
  navSideBarWidthMin: '56px',
};

export const getCssVar = (ref: RefObject<HTMLElement>, name: string): string => {
  const varName = name.replace(/^(var\()?(.*?)\)?$/i, '$2');
  const element = ref.current || document.documentElement;
  return window
    .getComputedStyle(findParentByClass(element, 'ui-provider'))
    ?.getPropertyValue(varName);
};
