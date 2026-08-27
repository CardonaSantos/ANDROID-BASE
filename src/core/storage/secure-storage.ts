import type { KeyValueStorage } from "./storage.types";

const values = new Map<string, string>();

/**
 * Web development fallback.
 *
 * It is intentionally memory-only.
 * Authentication persistence is a
 * native concern in this template.
 */
export const secureStorage: KeyValueStorage = Object.freeze({
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
