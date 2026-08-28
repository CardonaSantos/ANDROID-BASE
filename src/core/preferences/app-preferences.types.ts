export type AppThemePreference =
  | "system"
  | "light"
  | "dark";

export type AppPreferencesHydrationStatus =
  | "hydrating"
  | "hydrated"
  | "error";

export interface AppPreferencesState {
  themePreference:
    AppThemePreference;
}

export interface AppPreferencesActions {
  setThemePreference: (
    preference:
      AppThemePreference,
  ) => void;

  resetPreferences:
    () => void;
}

export type AppPreferencesStore =
  AppPreferencesState &
    AppPreferencesActions;

export type PersistedAppPreferences =
  Pick<
    AppPreferencesState,
    "themePreference"
  >;
