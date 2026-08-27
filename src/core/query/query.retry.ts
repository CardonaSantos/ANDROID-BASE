import { isAppError } from "@/core/errors";

import {
  DEFAULT_QUERY_RETRY_COUNT,
  QUERY_RETRY_BASE_DELAY_MS,
  QUERY_RETRY_MAX_DELAY_MS,
} from "./query.constants";

export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= DEFAULT_QUERY_RETRY_COUNT) {
    return false;
  }

  if (!isAppError(error)) {
    return false;
  }

  switch (error.kind) {
    case "network":
    case "timeout":
      return true;

    case "server":
      return isRetryableServerError(error.status);

    default:
      return false;
  }
}

export function getQueryRetryDelay(attemptIndex: number): number {
  const exponentialDelay = Math.min(
    QUERY_RETRY_BASE_DELAY_MS * 2 ** attemptIndex,

    QUERY_RETRY_MAX_DELAY_MS,
  );

  /*
   * Add jitter so many devices
   * reconnecting simultaneously
   * do not retry at exactly the
   * same instant.
   */
  const jitterFactor = 0.5 + Math.random() * 0.5;

  return Math.floor(exponentialDelay * jitterFactor);
}

function isRetryableServerError(status: number | undefined): boolean {
  if (status === undefined) {
    return true;
  }

  return status === 500 || status === 502 || status === 503 || status === 504;
}
