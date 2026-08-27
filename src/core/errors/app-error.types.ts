export type AppErrorKind =
  | "bad_request"
  | "network"
  | "timeout"
  | "cancelled"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation"
  | "rate_limited"
  | "server"
  | "storage"
  | "session"
  | "realtime"
  | "unknown";

export type AppErrorSource =
  | "application"
  | "http"
  | "network"
  | "storage"
  | "session"
  | "realtime"
  | "unknown";

export interface AppErrorOptions {
  kind: AppErrorKind;

  message: string;

  source?: AppErrorSource;

  code?: string;

  status?: number;

  details?: unknown;

  cause?: unknown;
}

export interface ToAppErrorOptions {
  kind?: AppErrorKind;

  message?: string;

  source?: AppErrorSource;

  code?: string;

  status?: number;

  details?: unknown;
}
