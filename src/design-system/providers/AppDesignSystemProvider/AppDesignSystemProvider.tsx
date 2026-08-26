import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { PaperProvider } from 'react-native-paper';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useUnistyles } from 'react-native-unistyles';

import {
  darkPaperTheme,
  lightPaperTheme,
} from '../../theme';
import { AppKeyboardProvider } from '../AppKeyboardProvider';

import type {
  AppDesignSystemProviderProps,
} from './AppDesignSystemProvider.types';

/**
 * Root-level Design System provider.
 *
 * Responsibilities:
 * - install Gesture Handler's root required by gesture-driven components;
 * - initialize native Keyboard Controller infrastructure;
 * - keep Paper internals synchronized with the active NOVA theme;
 * - provide Paper Portal.Host;
 * - provide Gorhom BottomSheetModal context.
 *
 * Feature code must not install duplicate provider trees.
 */
export const AppDesignSystemProvider = ({
  children,
  preloadKeyboard = true,
}: AppDesignSystemProviderProps) => {
  const { theme } = useUnistyles();

  const paperTheme =
    theme.isDark
      ? darkPaperTheme
      : lightPaperTheme;

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <AppKeyboardProvider
        preload={preloadKeyboard}
      >
        <PaperProvider
          theme={paperTheme}
        >
          <BottomSheetModalProvider>
            {children}
          </BottomSheetModalProvider>
        </PaperProvider>
      </AppKeyboardProvider>
    </GestureHandlerRootView>
  );
};
