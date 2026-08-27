import type {
  AppErrorKind,
  AppErrorOptions,
  AppErrorSource,
} from "./app-error.types";

export class AppError extends Error {
  readonly kind: AppErrorKind;

  readonly source: AppErrorSource;

  readonly code?: string;

  readonly status?: number;

  readonly details?: unknown;

  constructor(options: AppErrorOptions) {
    const {
      kind,
      message,
      source = "application",
      code,
      status,
      details,
      cause,
    } = options;

    super(message, cause === undefined ? undefined : { cause });

    this.name = "AppError";

    this.kind = kind;
    this.source = source;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
