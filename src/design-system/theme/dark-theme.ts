import {
  accessibility,
  elevation,
  interaction,
  motion,
  opacity,
  palette,
  radius,
  sizes,
  spacing,
  typography,
  zIndex,
} from '../tokens';

import type { AppTheme } from './theme.types';

export const darkTheme = {
  name: 'dark',
  isDark: true,

  colors: {
    background: palette.darkSurface.background,
    surface: palette.darkSurface.surface,
    surfaceSecondary: palette.darkSurface.secondary,
    surfaceElevated: palette.darkSurface.elevated,
    surfacePressed: palette.darkSurface.pressed,

    text: '#F4F7F6',
    textSecondary: '#C3CCC8',
    textMuted: '#97A59F',
    textDisabled: '#66736D',
    textInverse: palette.neutral[900],

    primary: '#4AD5B1',
    primaryHover: '#58DCBA',
    primaryPressed: '#35C49F',
    primaryStrong: '#74E4C6',
    onPrimary: '#07130F',
    primaryContainer: '#123B31',
    onPrimaryContainer: '#A5F2D9',

    secondary: '#E7ECEA',
    secondaryHover: '#F2F5F4',
    secondaryPressed: '#C7D0CC',
    onSecondary: palette.neutral[900],
    secondaryContainer: palette.neutral[800],
    onSecondaryContainer: '#E7ECEA',

    success: palette.success[400],
    onSuccess: palette.success[950],
    successContainer: '#133726',
    onSuccessContainer: palette.success[300],

    warning: palette.warning[400],
    onWarning: '#1A1203',
    warningContainer: '#44310E',
    onWarningContainer: palette.warning[300],

    danger: palette.danger[400],
    onDanger: palette.danger[950],
    dangerContainer: '#4A1F25',
    onDangerContainer: palette.danger[300],

    info: palette.info[400],
    onInfo: palette.info[950],
    infoContainer: '#172F55',
    onInfoContainer: palette.info[300],

    border: '#2B3732',
    borderStrong: '#46544E',
    divider: '#202A26',
    outline: '#97A59F',
    focusRing: '#74E4C6',

    overlay: 'rgba(0, 0, 0, 0.64)',
    scrim: 'rgba(0, 0, 0, 0.72)',
    shadow: 'rgba(0, 0, 0, 0.42)',

    inverseSurface: '#F4F7F6',
    inverseOnSurface: palette.neutral[900],
    inversePrimary: palette.nova[700],
  },

  spacing,
  radius,
  sizes,
  typography,
  elevation,
  opacity,
  zIndex,
  motion,
  interaction,
  accessibility,
} satisfies AppTheme;
