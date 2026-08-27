import { AppError } from "./AppError";

import type { AppErrorKind, AppErrorSource } from "./app-error.types";

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isAppErrorKind(
  error: unknown,
  kind: AppErrorKind,
): error is AppError {
  return error instanceof AppError && error.kind === kind;
}

export function isAppErrorSource(
  error: unknown,
  source: AppErrorSource,
): error is AppError {
  return error instanceof AppError && error.source === source;
}

export function hasAppErrorCode(
  error: unknown,
  code: string,
): error is AppError {
  return error instanceof AppError && error.code === code;
}
