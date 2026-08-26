import type {
  accessibility,
  elevation,
  interaction,
  motion,
  opacity,
  radius,
  sizes,
  spacing,
  typography,
  zIndex,
} from '../tokens';

export type ThemeName = 'light' | 'dark';
export type ThemePreference = 'system' | ThemeName;

export interface SemanticColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  surfacePressed: string;

  text: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;
  textInverse: string;

  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primaryStrong: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  secondaryHover: string;
  secondaryPressed: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  success: string;
  onSuccess: string;
  successContainer: string;
  onSuccessContainer: string;

  warning: string;
  onWarning: string;
  warningContainer: string;
  onWarningContainer: string;

  danger: string;
  onDanger: string;
  dangerContainer: string;
  onDangerContainer: string;

  info: string;
  onInfo: string;
  infoContainer: string;
  onInfoContainer: string;

  border: string;
  borderStrong: string;
  divider: string;
  outline: string;
  focusRing: string;

  overlay: string;
  scrim: string;
  shadow: string;

  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export interface AppTheme {
  name: ThemeName;
  isDark: boolean;
  colors: SemanticColors;

  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  typography: typeof typography;
  elevation: typeof elevation;
  opacity: typeof opacity;
  zIndex: typeof zIndex;

  motion: typeof motion;
  interaction: typeof interaction;
  accessibility: typeof accessibility;
}
