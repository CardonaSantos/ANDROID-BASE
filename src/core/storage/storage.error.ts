import { AppError } from "@/core/errors";

import type { StorageDriver, StorageOperation } from "./storage.types";

const STORAGE_ERROR_MESSAGES = {
  read: "Unable to read local data.",

  write: "Unable to save local data.",

  remove: "Unable to remove local data.",
} satisfies Record<StorageOperation, string>;

const STORAGE_ERROR_PREFIX = {
  secure: "SECURE_STORAGE",

  preferences: "PREFERENCES_STORAGE",
} satisfies Record<StorageDriver, string>;

const STORAGE_OPERATION_CODE = {
  read: "READ",
  write: "WRITE",
  remove: "REMOVE",
} satisfies Record<StorageOperation, string>;

export function createStorageError(
  driver: StorageDriver,
  operation: StorageOperation,
  cause: unknown,
): AppError {
  const code = [
    STORAGE_ERROR_PREFIX[driver],
    STORAGE_OPERATION_CODE[operation],
    "FAILED",
  ].join("_");

  return new AppError({
    kind: "storage",
    source: "storage",

    code,

    message: STORAGE_ERROR_MESSAGES[operation],

    details: {
      driver,
      operation,
    },

    cause,
  });
}
