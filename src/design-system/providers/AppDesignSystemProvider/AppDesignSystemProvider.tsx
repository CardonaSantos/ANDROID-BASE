import { PaperProvider } from 'react-native-paper';
import { useUnistyles } from 'react-native-unistyles';

import {
  darkPaperTheme,
  lightPaperTheme,
} from '../../theme';
import { AppKeyboardProvider } from '../AppKeyboardProvider';

import type { AppDesignSystemProviderProps } from './AppDesignSystemProvider.types';

/**
 * Root-level Design System provider.
 *
 * Responsibilities:
 * - keep Paper internals synchronized with the active NOVA theme;
 * - provide Paper Portal.Host;
 * - initialize native Keyboard Controller infrastructure.
 */
export const AppDesignSystemProvider = ({
  children,
  preloadKeyboard = true,
}: AppDesignSystemProviderProps) => {
  const { theme } = useUnistyles();

  const paperTheme = theme.isDark
    ? darkPaperTheme
    : lightPaperTheme;

  return (
    <AppKeyboardProvider
      preload={preloadKeyboard}
    >
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </AppKeyboardProvider>
  );
};
