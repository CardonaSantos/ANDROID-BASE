import { useSyncExternalStore } from 'react';

import { accessibilityPreferences } from './accessibility-preferences';

/**
 * Reactive view of OS accessibility preferences.
 *
 * This is infrastructure state, not business state. It deliberately does not
 * live in Zustand.
 */
export const useAccessibilityPreferences = () =>
  useSyncExternalStore(
    accessibilityPreferences.subscribe,
    accessibilityPreferences.getSnapshot,
    accessibilityPreferences.getServerSnapshot,
  );
