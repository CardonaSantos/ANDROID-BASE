import { persist } from "zustand/middleware";

import { createStore } from "zustand/vanilla";

import { createPreferencesPersistStorage } from "@/core/storage";

import { persistedAppPreferencesSchema } from "./app-preferences.schema";

import type {
  AppPreferencesState,
  AppPreferencesStore,
  PersistedAppPreferences,
} from "./app-preferences.types";

const APP_PREFERENCES_STORAGE_KEY = "app.preferences";

const APP_PREFERENCES_STORAGE_VERSION = 1;

const DEFAULT_APP_PREFERENCES: AppPreferencesState = {
  themePreference: "system",
};

export const appPreferencesStore = createStore<AppPreferencesStore>()(
  persist<AppPreferencesStore, [], [], PersistedAppPreferences>(
    (set) => ({
      ...DEFAULT_APP_PREFERENCES,

      setThemePreference: (themePreference) => {
        set({
          themePreference,
        });
      },

      resetPreferences: () => {
        set(DEFAULT_APP_PREFERENCES);
      },
    }),

    {
      name: APP_PREFERENCES_STORAGE_KEY,

      version: APP_PREFERENCES_STORAGE_VERSION,

      storage: createPreferencesPersistStorage<PersistedAppPreferences>(),

      partialize: (state): PersistedAppPreferences => ({
        themePreference: state.themePreference,
      }),

      merge: (persistedState, currentState): AppPreferencesStore => {
        const result = persistedAppPreferencesSchema.safeParse(persistedState);

        if (!result.success) {
          return currentState;
        }

        return {
          ...currentState,

          ...result.data,
        };
      },
    },
  ),
);
