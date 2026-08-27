import * as SecureStore from "expo-secure-store";

import { runStorageOperation } from "./storage.utils";

import type { KeyValueStorage } from "./storage.types";

export const secureStorage: KeyValueStorage = Object.freeze({
  async getItem(key: string): Promise<string | null> {
    return runStorageOperation("secure", "read", () =>
      SecureStore.getItemAsync(key),
    );
  },

  async setItem(key: string, value: string): Promise<void> {
    await runStorageOperation("secure", "write", () =>
      SecureStore.setItemAsync(key, value),
    );
  },

  async removeItem(key: string): Promise<void> {
    await runStorageOperation("secure", "remove", () =>
      SecureStore.deleteItemAsync(key),
    );
  },
});
