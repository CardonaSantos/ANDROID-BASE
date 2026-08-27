import KvStore from "expo-sqlite/kv-store";

import { runStorageOperation } from "./storage.utils";

import type { KeyValueStorage } from "./storage.types";

export const preferencesStorage: KeyValueStorage = Object.freeze({
  async getItem(key: string): Promise<string | null> {
    return runStorageOperation("preferences", "read", () =>
      KvStore.getItem(key),
    );
  },

  async setItem(key: string, value: string): Promise<void> {
    await runStorageOperation("preferences", "write", () =>
      KvStore.setItem(key, value),
    );
  },

  async removeItem(key: string): Promise<void> {
    await runStorageOperation("preferences", "remove", () =>
      KvStore.removeItem(key),
    );
  },
});
