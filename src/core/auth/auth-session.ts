import { AppError } from "@/core/errors";

import { createAuthSessionCoordinator } from "./create-auth-session-coordinator";

import type { AuthRefreshHandler } from "./auth.types";

let refreshHandler: AuthRefreshHandler | null = null;

function getRefreshHandler(): AuthRefreshHandler {
  if (!refreshHandler) {
    throw new AppError({
      kind: "session",

      source: "session",

      code: "AUTH_REFRESH_HANDLER_NOT_CONFIGURED",

      message: "Authentication refresh handler is not configured.",
    });
  }

  return refreshHandler;
}

export const authSessionCoordinator = createAuthSessionCoordinator({
  refresh: (context) => {
    const handler = getRefreshHandler();

    return handler(context);
  },
});

export function configureAuthRefreshHandler(
  handler: AuthRefreshHandler,
): () => void {
  if (refreshHandler !== null && refreshHandler !== handler) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "AUTH_REFRESH_HANDLER_ALREADY_CONFIGURED",

      message: "Authentication refresh handler is already configured.",
    });
  }

  refreshHandler = handler;

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;

    if (refreshHandler === handler) {
      refreshHandler = null;
    }
  };
}
