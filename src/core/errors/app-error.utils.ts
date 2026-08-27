import { AppError } from "./AppError";

import { isAppError } from "./app-error.guards";

import type { ToAppErrorOptions } from "./app-error.types";

const DEFAULT_ERROR_MESSAGE = "Unexpected application error.";

export function toAppError(
  error: unknown,
  options: ToAppErrorOptions = {},
): AppError {
  if (isAppError(error)) {
    return error;
  }

  const originalMessage = error instanceof Error ? error.message.trim() : "";

  const message = options.message ?? originalMessage ?? DEFAULT_ERROR_MESSAGE;

  return new AppError({
    kind: options.kind ?? "unknown",

    source: options.source ?? "unknown",

    message: message || DEFAULT_ERROR_MESSAGE,

    code: options.code,

    status: options.status,

    details: options.details,

    cause: error,
  });
}
