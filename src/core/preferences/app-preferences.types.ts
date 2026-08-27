export type AppThemePreference = "system" | "light" | "dark";

export interface AppPreferencesState {
  themePreference: AppThemePreference;
}

export interface AppPreferencesActions {
  setThemePreference: (preference: AppThemePreference) => void;

  resetPreferences: () => void;
}

export type AppPreferencesStore = AppPreferencesState & AppPreferencesActions;

export type PersistedAppPreferences = Pick<
  AppPreferencesState,
  "themePreference"
>;
