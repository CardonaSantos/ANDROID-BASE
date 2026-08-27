import { AppError } from "@/core/errors";

export type SessionErrorCode =
  | "SESSION_INVALID_TOKEN"
  | "SESSION_INVALID_TRANSITION";

export function createSessionError(
  code: SessionErrorCode,
  message: string,
  cause?: unknown,
): AppError {
  return new AppError({
    kind: "session",
    source: "session",
    code,
    message,
    cause,
  });
}
