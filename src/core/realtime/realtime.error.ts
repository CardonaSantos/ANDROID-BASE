import { AppError, isAppError } from "@/core/errors";

export type RealtimeErrorCode =
  | "REALTIME_NOT_CONNECTED"
  | "REALTIME_ACCESS_TOKEN_MISSING"
  | "REALTIME_CONNECTION_FAILED"
  | "REALTIME_CONNECTION_TIMEOUT"
  | "REALTIME_SOCKET_ERROR"
  | "REALTIME_INVALID_MESSAGE"
  | "REALTIME_SERIALIZATION_FAILED"
  | "REALTIME_SEND_FAILED"
  | "REALTIME_WEB_HEADERS_UNSUPPORTED";

export function createRealtimeError(
  code: RealtimeErrorCode,
  message: string,
  cause?: unknown,
): AppError {
  return new AppError({
    kind: "realtime",
    source: "realtime",
    code,
    message,
    cause,
  });
}

export function normalizeRealtimeError(
  cause: unknown,
  fallbackCode: RealtimeErrorCode,
  fallbackMessage: string,
): AppError {
  if (isAppError(cause) && cause.source === "realtime") {
    return cause;
  }

  return createRealtimeError(fallbackCode, fallbackMessage, cause);
}
