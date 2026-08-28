import { AppError, isAppErrorKind } from "@/core/errors";

import { sessionManager } from "@/core/session";

import type {
  AuthSessionCoordinator,
  AuthTokenPair,
  CreateAuthSessionCoordinatorOptions,
} from "./auth.types";

function createRefreshUnavailableError(): AppError {
  return new AppError({
    kind: "session",

    source: "session",

    code: "AUTH_REFRESH_UNAVAILABLE",

    message: "The current session cannot be refreshed.",
  });
}

function isTerminalRefreshFailure(cause: unknown): boolean {
  return (
    isAppErrorKind(cause, "unauthorized") || isAppErrorKind(cause, "forbidden")
  );
}

export function createAuthSessionCoordinator(
  options: CreateAuthSessionCoordinatorOptions,
): AuthSessionCoordinator {
  let refreshPromise: Promise<string> | null = null;

  async function requestNewTokens(
    refreshToken: string,
  ): Promise<AuthTokenPair> {
    return options.refresh({
      refreshToken,
    });
  }

  async function performRefresh(): Promise<string> {
    const refreshToken = sessionManager.getRefreshToken();

    if (!refreshToken) {
      throw createRefreshUnavailableError();
    }

    try {
      const tokens = await requestNewTokens(refreshToken);

      const snapshot = sessionManager.getSnapshot();

      if (snapshot.status === "restoring") {
        await sessionManager.completeRestore({
          accessToken: tokens.accessToken,

          refreshToken: tokens.refreshToken,
        });

        return tokens.accessToken;
      }

      if (snapshot.status === "authenticated") {
        await sessionManager.updateTokens({
          accessToken: tokens.accessToken,

          refreshToken: tokens.refreshToken,
        });

        return tokens.accessToken;
      }

      throw createRefreshUnavailableError();
    } catch (cause) {
      if (isTerminalRefreshFailure(cause)) {
        await sessionManager.clear();
      }

      throw cause;
    }
  }

  function refreshSingleFlight(): Promise<string> {
    if (refreshPromise) {
      return refreshPromise;
    }

    const operation = performRefresh();

    refreshPromise = operation;

    operation.then(
      () => {
        if (refreshPromise === operation) {
          refreshPromise = null;
        }
      },

      () => {
        if (refreshPromise === operation) {
          refreshPromise = null;
        }
      },
    );

    return operation;
  }

  async function restore(): Promise<void> {
    const snapshot = sessionManager.getSnapshot();

    if (snapshot.status !== "restoring") {
      return;
    }

    await refreshSingleFlight();
  }

  async function refresh(): Promise<string> {
    const snapshot = sessionManager.getSnapshot();

    if (snapshot.status !== "authenticated") {
      throw createRefreshUnavailableError();
    }

    return refreshSingleFlight();
  }

  async function clear(): Promise<void> {
    await sessionManager.clear();
  }

  return Object.freeze({
    restore,

    refresh,

    clear,
  });
}
