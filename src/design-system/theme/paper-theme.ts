import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from 'react-native-paper';

import { darkTheme } from './dark-theme';
import { lightTheme } from './light-theme';

const createPaperFonts = (theme: typeof lightTheme | typeof darkTheme) =>
  configureFonts({
    config: {
      displayLarge: theme.typography.displayLarge,
      displayMedium: theme.typography.displayMedium,
      displaySmall: theme.typography.headlineLarge,

      headlineLarge: theme.typography.headlineLarge,
      headlineMedium: theme.typography.headlineMedium,
      headlineSmall: theme.typography.headlineSmall,

      titleLarge: theme.typography.titleLarge,
      titleMedium: theme.typography.titleMedium,
      titleSmall: theme.typography.titleSmall,

      bodyLarge: theme.typography.bodyLarge,
      bodyMedium: theme.typography.bodyMedium,
      bodySmall: theme.typography.bodySmall,

      labelLarge: theme.typography.labelLarge,
      labelMedium: theme.typography.labelMedium,
      labelSmall: theme.typography.labelSmall,
    },
  });

const mapToPaperTheme = (
  theme: typeof lightTheme | typeof darkTheme,
  base: MD3Theme,
): MD3Theme => ({
  ...base,
  dark: theme.isDark,
  roundness: theme.radius.sm,
  fonts: createPaperFonts(theme),

  colors: {
    ...base.colors,

    primary: theme.colors.primary,
    onPrimary: theme.colors.onPrimary,
    primaryContainer: theme.colors.primaryContainer,
    onPrimaryContainer: theme.colors.onPrimaryContainer,

    secondary: theme.colors.secondary,
    onSecondary: theme.colors.onSecondary,
    secondaryContainer: theme.colors.secondaryContainer,
    onSecondaryContainer: theme.colors.onSecondaryContainer,

    tertiary: theme.colors.info,
    onTertiary: theme.colors.onInfo,
    tertiaryContainer: theme.colors.infoContainer,
    onTertiaryContainer: theme.colors.onInfoContainer,

    error: theme.colors.danger,
    onError: theme.colors.onDanger,
    errorContainer: theme.colors.dangerContainer,
    onErrorContainer: theme.colors.onDangerContainer,

    background: theme.colors.background,
    onBackground: theme.colors.text,

    surface: theme.colors.surface,
    onSurface: theme.colors.text,
    surfaceVariant: theme.colors.surfaceSecondary,
    onSurfaceVariant: theme.colors.textSecondary,

    outline: theme.colors.borderStrong,
    outlineVariant: theme.colors.border,

    shadow: '#000000',
    scrim: theme.colors.scrim,

    inverseSurface: theme.colors.inverseSurface,
    inverseOnSurface: theme.colors.inverseOnSurface,
    inversePrimary: theme.colors.inversePrimary,

    surfaceDisabled: theme.colors.surfacePressed,
    onSurfaceDisabled: theme.colors.textDisabled,
    backdrop: theme.colors.overlay,

    elevation: {
      level0: 'transparent',
      level1: theme.isDark ? '#151B19' : '#FAFCFB',
      level2: theme.isDark ? '#18201D' : '#F6FAF8',
      level3: theme.isDark ? '#1D2622' : '#F2F7F5',
      level4: theme.isDark ? '#222C28' : '#EEF5F2',
      level5: theme.isDark ? '#27322E' : '#EAF2EF',
    },
  },
});

export const lightPaperTheme = mapToPaperTheme(lightTheme, MD3LightTheme);
export const darkPaperTheme = mapToPaperTheme(darkTheme, MD3DarkTheme);

export const paperThemes = {
  light: lightPaperTheme,
  dark: darkPaperTheme,
} as const;
