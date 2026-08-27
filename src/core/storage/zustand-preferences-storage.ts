import { createJSONStorage, type PersistStorage } from "zustand/middleware";

import { preferencesStorage } from "./preferences-storage";

export function createPreferencesPersistStorage<T>(): PersistStorage<T> {
  const storage = createJSONStorage<T>(() => preferencesStorage);

  if (!storage) {
    throw new Error("Preferences persistence storage is unavailable.");
  }

  return storage;
}
