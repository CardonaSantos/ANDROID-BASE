import { AppError } from "@/core/errors";

export type RealtimeErrorCode =
  | "REALTIME_NOT_CONNECTED"
  | "REALTIME_ACCESS_TOKEN_MISSING"
  | "REALTIME_CONNECTION_FAILED"
  | "REALTIME_CONNECTION_TIMEOUT"
  | "REALTIME_SOCKET_ERROR"
  | "REALTIME_INVALID_MESSAGE"
  | "REALTIME_SERIALIZATION_FAILED"
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
