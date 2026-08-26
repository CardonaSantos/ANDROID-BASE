import { Appearance } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from '../tokens';
import { appThemes } from './app-themes';

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppThemes['light'];
    dark: AppThemes['dark'];
  }

  export interface UnistylesBreakpoints {
    compact:
      AppBreakpoints['compact'];
    medium:
      AppBreakpoints['medium'];
    expanded:
      AppBreakpoints['expanded'];
    wide:
      AppBreakpoints['wide'];
  }
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    // We manage system/light/dark ourselves so that manual overrides can coexist
    // with automatic device mode.
    initialTheme: () => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'),
    CSSVars: true,
    nativeBreakpointsMode: 'points',
  },
});
