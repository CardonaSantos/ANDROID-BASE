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

export const lightTheme = {
  name: 'light',
  isDark: false,

  colors: {
    background: palette.neutral[50],
    surface: palette.neutral[0],
    surfaceSecondary: palette.neutral[100],
    surfaceElevated: palette.neutral[0],
    surfacePressed: palette.neutral[150],

    text: palette.neutral[900],
    textSecondary: palette.neutral[600],
    textMuted: palette.neutral[500],
    textDisabled: palette.neutral[400],
    textInverse: palette.neutral[50],

    primary: palette.nova[500],
    primaryHover: palette.nova[400],
    primaryPressed: palette.nova[600],
    primaryStrong: palette.nova[700],
    onPrimary: '#07130F',
    primaryContainer: '#D9F7EE',
    onPrimaryContainer: '#0D4D3C',

    secondary: palette.neutral[900],
    secondaryHover: palette.neutral[800],
    secondaryPressed: palette.neutral[700],
    onSecondary: palette.neutral[0],
    secondaryContainer: palette.neutral[100],
    onSecondaryContainer: palette.neutral[900],

    success: palette.success[700],
    onSuccess: palette.neutral[0],
    successContainer: palette.success[100],
    onSuccessContainer: palette.success[900],

    warning: palette.warning[600],
    onWarning: palette.warning[950],
    warningContainer: palette.warning[100],
    onWarningContainer: palette.warning[900],

    danger: palette.danger[700],
    onDanger: palette.neutral[0],
    dangerContainer: palette.danger[100],
    onDangerContainer: palette.danger[900],

    info: palette.info[600],
    onInfo: palette.neutral[0],
    infoContainer: palette.info[100],
    onInfoContainer: palette.info[900],

    border: palette.neutral[200],
    borderStrong: palette.neutral[300],
    divider: '#E5ECE9',
    outline: palette.neutral[500],
    focusRing: palette.nova[700],

    overlay: 'rgba(17, 21, 19, 0.48)',
    scrim: 'rgba(0, 0, 0, 0.56)',
    shadow: 'rgba(17, 21, 19, 0.14)',

    inverseSurface: palette.neutral[900],
    inverseOnSurface: palette.neutral[50],
    inversePrimary: palette.nova[300],
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
