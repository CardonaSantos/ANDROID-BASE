import { Appearance } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from '../tokens';
import { appThemes } from './app-themes';

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
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
