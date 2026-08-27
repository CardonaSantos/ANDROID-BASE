import { useEffect, useState } from "react";

import { useStore } from "zustand";

import { appPreferencesStore } from "./app-preferences.store";

import type { AppThemePreference } from "./app-preferences.types";

export function useThemePreference(): AppThemePreference {
  return useStore(appPreferencesStore, (state) => state.themePreference);
}

export function useSetThemePreference() {
  return useStore(appPreferencesStore, (state) => state.setThemePreference);
}

export function useResetAppPreferences() {
  return useStore(appPreferencesStore, (state) => state.resetPreferences);
}

export function useHasAppPreferencesHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(() =>
    appPreferencesStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribeHydrate = appPreferencesStore.persist.onHydrate(() => {
      setHasHydrated(false);
    });

    const unsubscribeFinishHydration =
      appPreferencesStore.persist.onFinishHydration(() => {
        setHasHydrated(true);
      });

    setHasHydrated(appPreferencesStore.persist.hasHydrated());

    return () => {
      unsubscribeHydrate();

      unsubscribeFinishHydration();
    };
  }, []);

  return hasHydrated;
}
