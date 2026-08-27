import type { AppErrorKind } from "@/core/errors";

interface ParsedHttpErrorBody {
  message?: string;

  code?: string;

  details?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : undefined;
}

function readMessage(value: unknown): string | undefined {
  const direct = readString(value);

  if (direct) {
    return direct;
  }

  if (Array.isArray(value)) {
    const messages = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return undefined;
}

export function parseHttpErrorBody(body: unknown): ParsedHttpErrorBody {
  if (typeof body === "string") {
    return {
      message: readString(body),
    };
  }

  if (!isRecord(body)) {
    return {};
  }

  return {
    message: readMessage(body.message) ?? readString(body.error),

    code: readString(body.code),

    details: body.details,
  };
}

export function getHttpErrorKind(status: number): AppErrorKind {
  switch (status) {
    case 400:
      return "bad_request";

    case 401:
      return "unauthorized";

    case 403:
      return "forbidden";

    case 404:
      return "not_found";

    case 408:
      return "timeout";

    case 409:
      return "conflict";

    case 422:
      return "validation";

    case 429:
      return "rate_limited";

    default:
      if (status >= 500) {
        return "server";
      }

      if (status >= 400) {
        return "bad_request";
      }

      return "unknown";
  }
}

export function getDefaultHttpMessage(kind: AppErrorKind): string {
  switch (kind) {
    case "network":
      return "Unable to connect to the server.";

    case "timeout":
      return "The request took too long to complete.";

    case "cancelled":
      return "The request was cancelled.";

    case "unauthorized":
      return "Authentication is required.";

    case "forbidden":
      return "You do not have permission to perform this action.";

    case "not_found":
      return "The requested resource was not found.";

    case "conflict":
      return "The request conflicts with the current state.";

    case "validation":
      return "Some submitted data is invalid.";

    case "rate_limited":
      return "Too many requests. Please try again later.";

    case "server":
      return "The server could not complete the request.";

    case "bad_request":
      return "The request could not be processed.";

    default:
      return "Unexpected HTTP error.";
  }
}
