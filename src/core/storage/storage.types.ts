export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;

  setItem(key: string, value: string): Promise<void>;

  removeItem(key: string): Promise<void>;
}

export type StorageDriver = "secure" | "preferences";

export type StorageOperation = "read" | "write" | "remove";
