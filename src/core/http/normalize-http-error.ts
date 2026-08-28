import {
  isAxiosError,
} from "axios";

import {
  AppError,
  isAppError,
  toAppError,
} from "@/core/errors";

import {
  getDefaultHttpMessage,
  getHttpErrorKind,
  parseHttpErrorBody,
  shouldUseServerCode,
  shouldUseServerDetails,
  shouldUseServerMessage,
} from "./http-error.utils";

export function normalizeHttpError(
  error: unknown,
): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (!isAxiosError(error)) {
    return toAppError(
      error,
      {
        kind:
          "unknown",

        source:
          "http",

        message:
          "Unexpected HTTP error.",
      },
    );
  }

  if (
    error.code ===
    "ERR_CANCELED"
  ) {
    return new AppError({
      kind:
        "cancelled",

      source:
        "http",

      code:
        "HTTP_REQUEST_CANCELLED",

      message:
        getDefaultHttpMessage(
          "cancelled",
        ),

      cause:
        error,
    });
  }

  if (
    error.code ===
      "ETIMEDOUT" ||
    error.code ===
      "ECONNABORTED"
  ) {
    return new AppError({
      kind:
        "timeout",

      source:
        "http",

      code:
        "HTTP_REQUEST_TIMEOUT",

      message:
        getDefaultHttpMessage(
          "timeout",
        ),

      cause:
        error,
    });
  }

  if (
    error.code ===
      "ERR_NETWORK" ||
    error.code ===
      "ECONNREFUSED" ||
    (
      !error.response &&
      error.request
    )
  ) {
    return new AppError({
      kind:
        "network",

      source:
        "http",

      code:
        "HTTP_NETWORK_ERROR",

      message:
        getDefaultHttpMessage(
          "network",
        ),

      cause:
        error,
    });
  }

  const status =
    error.response?.status;

  if (
    typeof status ===
    "number"
  ) {
    const kind =
      getHttpErrorKind(
        status,
      );

    const parsed =
      parseHttpErrorBody(
        error.response?.data,
      );

    const message =
      shouldUseServerMessage(
        status,
      ) &&
      parsed.message
        ? parsed.message
        : getDefaultHttpMessage(
            kind,
          );

    const code =
      shouldUseServerCode(
        status,
      ) &&
      parsed.code
        ? parsed.code
        : `HTTP_${status}`;

    const details =
      shouldUseServerDetails(
        status,
      )
        ? parsed.details
        : undefined;

    return new AppError({
      kind,

      source:
        "http",

      status,

      code,

      message,

      details,

      cause:
        error,
    });
  }

  return new AppError({
    kind:
      "unknown",

    source:
      "http",

    code:
      error.code ??
      "HTTP_UNKNOWN_ERROR",

    message:
      "Unexpected HTTP error.",

    cause:
      error,
  });
}
