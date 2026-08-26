import { darkTheme } from './dark-theme';
import { lightTheme } from './light-theme';

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type AppThemes = typeof appThemes;
