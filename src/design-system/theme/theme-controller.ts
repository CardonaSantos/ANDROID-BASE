import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

import type { ThemeName, ThemePreference } from './theme.types';

let preference: ThemePreference = 'system';

const resolveSystemTheme = (): ThemeName =>
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

const apply = () => {
  const nextTheme: ThemeName =
    preference === 'system' ? resolveSystemTheme() : preference;

  if (UnistylesRuntime.themeName !== nextTheme) {
    UnistylesRuntime.setTheme(nextTheme);
  }
};

const appearanceSubscription = Appearance.addChangeListener(() => {
  if (preference === 'system') {
    apply();
  }
});

export const themeController = {
  getPreference(): ThemePreference {
    return preference;
  },

  setPreference(nextPreference: ThemePreference): void {
    preference = nextPreference;
    apply();
  },

  applySystemPreference(): void {
    preference = 'system';
    apply();
  },

  dispose(): void {
    appearanceSubscription.remove();
  },
} as const;

// Default behavior: follow the operating system.
apply();
