import { createStorageError } from "./storage.error";

import type { StorageDriver, StorageOperation } from "./storage.types";

export async function runStorageOperation<TResult>(
  driver: StorageDriver,
  operation: StorageOperation,
  action: () => Promise<TResult>,
): Promise<TResult> {
  try {
    return await action();
  } catch (cause) {
    throw createStorageError(driver, operation, cause);
  }
}
