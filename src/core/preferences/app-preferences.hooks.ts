import {
  useStore,
} from "zustand";

import type {
  AppError,
} from "@/core/errors";

import {
  appPreferencesHydrationStore,
} from "./_internal/app-preferences-hydration.store";

import {
  appPreferencesStore,
} from "./app-preferences.store";

import type {
  AppPreferencesHydrationStatus,
  AppThemePreference,
} from "./app-preferences.types";

export function useThemePreference():
  AppThemePreference {
  return useStore(
    appPreferencesStore,
    (state) =>
      state.themePreference,
  );
}

export function useSetThemePreference() {
  return useStore(
    appPreferencesStore,
    (state) =>
      state.setThemePreference,
  );
}

export function useResetAppPreferences() {
  return useStore(
    appPreferencesStore,
    (state) =>
      state.resetPreferences,
  );
}

export function useAppPreferencesHydrationStatus():
  AppPreferencesHydrationStatus {
  return useStore(
    appPreferencesHydrationStore,
    (state) =>
      state.status,
  );
}

export function useAppPreferencesHydrationError():
  AppError | null {
  return useStore(
    appPreferencesHydrationStore,
    (state) =>
      state.error,
  );
}

export function useAreAppPreferencesSettled():
  boolean {
  const status =
    useAppPreferencesHydrationStatus();

  return status !==
    "hydrating";
}

export function useHasAppPreferencesHydrated():
  boolean {
  const status =
    useAppPreferencesHydrationStatus();

  return status ===
    "hydrated";
}
