import { KeyboardProvider } from 'react-native-keyboard-controller';

import type { AppKeyboardProviderProps } from './AppKeyboardProvider.types';

/**
 * Native keyboard infrastructure.
 *
 * react-native-keyboard-controller requires KeyboardProvider near the app root.
 */
export const AppKeyboardProvider = ({
  children,
  preload = true,
}: AppKeyboardProviderProps) => (
  <KeyboardProvider preload={preload}>
    {children}
  </KeyboardProvider>
);
