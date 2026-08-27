import { z } from "zod";

export const appThemePreferenceSchema = z.enum(["system", "light", "dark"]);

export const persistedAppPreferencesSchema = z.strictObject({
  themePreference: appThemePreferenceSchema,
});
