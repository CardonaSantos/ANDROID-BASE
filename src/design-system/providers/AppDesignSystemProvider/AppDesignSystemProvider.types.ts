import type { ReactNode } from 'react';

export interface AppDesignSystemProviderProps {
  children: ReactNode;

  /**
   * Native only. Keyboard Controller preloads the keyboard by default to avoid
   * first-focus latency. Set false if a specific device/app-start flicker is
   * observed and preload manually later.
   */
  preloadKeyboard?: boolean;
}
