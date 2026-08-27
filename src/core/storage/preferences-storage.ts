import type { KeyValueStorage } from "./storage.types";

const values = new Map<string, string>();

/**
 * Web development fallback.
 *
 * Native applications use the
 * SQLite-backed implementation.
 */
export const preferencesStorage: KeyValueStorage = Object.freeze({
  async getItem(key: string): Promise<string | null> {
    return values.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    values.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    values.delete(key);
  },
});
