import type { AppKeyboardProviderProps } from './AppKeyboardProvider.types';

/**
 * Web/fallback provider.
 *
 * Browser keyboards do not use the native Keyboard Controller runtime.
 */
export const AppKeyboardProvider = ({
  children,
}: AppKeyboardProviderProps) => children;
