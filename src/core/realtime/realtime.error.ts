import { AppError, isAppError } from "@/core/errors";

/*
 * =========================================================
 * REALTIME ERROR CODES
 * =========================================================
 *
 * Estos errores describen nuestra abstracción realtime,
 * no detalles internos de Engine.IO / Socket.IO.
 * =========================================================
 */

export type RealtimeErrorCode =
  | "REALTIME_NOT_CONNECTED"
  | "REALTIME_ACCESS_TOKEN_MISSING"
  | "REALTIME_CONNECTION_FAILED"
  | "REALTIME_SOCKET_ERROR"
  | "REALTIME_SEND_FAILED";

/*
 * =========================================================
 * CREATE
 * =========================================================
 */

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

/*
 * =========================================================
 * NORMALIZE
 * =========================================================
 */

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
