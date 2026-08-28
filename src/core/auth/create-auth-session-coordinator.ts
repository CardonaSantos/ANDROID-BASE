import {
  AppError,
  isAppErrorKind,
} from "@/core/errors";

import {
  sessionManager,
  sessionTokenProvider,
} from "@/core/session";

import type {
  AuthSessionCoordinator,
  AuthTokenPair,
  CreateAuthSessionCoordinatorOptions,
} from "./auth.types";

function createRefreshUnavailableError():
  AppError {
  return new AppError({
    kind: "session",

    source: "session",

    code:
      "AUTH_REFRESH_UNAVAILABLE",

    message:
      "The current session cannot be refreshed.",
  });
}

function createSessionChangedDuringRefreshError():
  AppError {
  return new AppError({
    kind: "session",

    source: "session",

    code:
      "AUTH_SESSION_CHANGED_DURING_REFRESH",

    message:
      "The session changed while authentication was being refreshed.",
  });
}

function isTerminalRefreshFailure(
  cause: unknown,
): boolean {
  return (
    isAppErrorKind(
      cause,
      "unauthorized",
    ) ||
    isAppErrorKind(
      cause,
      "forbidden",
    )
  );
}

function captureRefreshContext(
  refreshToken: string,
) {
  const snapshot =
    sessionManager.getSnapshot();

  return {
    status:
      snapshot.status,

    persistenceStrategy:
      snapshot.persistenceStrategy,

    accessToken:
      sessionTokenProvider.getAccessToken(),

    refreshToken,
  };
}

function isSameRefreshContext(
  context:
    ReturnType<
      typeof captureRefreshContext
    >,
): boolean {
  const snapshot =
    sessionManager.getSnapshot();

  return (
    snapshot.status ===
      context.status &&
    snapshot.persistenceStrategy ===
      context.persistenceStrategy &&
    sessionTokenProvider.getAccessToken() ===
      context.accessToken &&
    sessionManager.getRefreshToken() ===
      context.refreshToken
  );
}

export function createAuthSessionCoordinator(
  options:
    CreateAuthSessionCoordinatorOptions,
): AuthSessionCoordinator {
  let refreshPromise:
    Promise<string> | null =
    null;

  async function requestNewTokens(
    refreshToken: string,
  ): Promise<AuthTokenPair> {
    return options.refresh({
      refreshToken,
    });
  }

  async function performRefresh():
    Promise<string> {
    const refreshToken =
      sessionManager.getRefreshToken();

    if (!refreshToken) {
      const snapshot =
        sessionManager.getSnapshot();

      if (
        snapshot.status ===
          "authenticated" ||
        snapshot.status ===
          "restoring"
      ) {
        await sessionManager.clear();
      }

      throw createRefreshUnavailableError();
    }

    const refreshContext =
      captureRefreshContext(
        refreshToken,
      );

    try {
      const tokens =
        await requestNewTokens(
          refreshToken,
        );

      /*
       * Never apply credentials obtained
       * for an older session to a newer
       * login/session that became active
       * while the refresh request was in
       * flight.
       */
      if (
        !isSameRefreshContext(
          refreshContext,
        )
      ) {
        throw createSessionChangedDuringRefreshError();
      }

      const snapshot =
        sessionManager.getSnapshot();

      if (
        snapshot.status ===
        "restoring"
      ) {
        await sessionManager.completeRestore(
          {
            accessToken:
              tokens.accessToken,

            refreshToken:
              tokens.refreshToken,
          },
        );

        return tokens.accessToken;
      }

      if (
        snapshot.status ===
        "authenticated"
      ) {
        await sessionManager.updateTokens(
          {
            accessToken:
              tokens.accessToken,

            refreshToken:
              tokens.refreshToken,
          },
        );

        return tokens.accessToken;
      }

      throw createRefreshUnavailableError();
    } catch (cause) {
      /*
       * A rejected OLD refresh must never
       * log out a NEW session.
       *
       * Clear only when the credentials
       * that started this refresh still
       * represent the active session.
       */
      if (
        isTerminalRefreshFailure(
          cause,
        ) &&
        isSameRefreshContext(
          refreshContext,
        )
      ) {
        await sessionManager.clear();
      }

      throw cause;
    }
  }

  function refreshSingleFlight():
    Promise<string> {
    if (refreshPromise) {
      return refreshPromise;
    }

    const operation =
      performRefresh();

    refreshPromise =
      operation;

    operation.then(
      () => {
        if (
          refreshPromise === operation
        ) {
          refreshPromise = null;
        }
      },

      () => {
        if (
          refreshPromise === operation
        ) {
          refreshPromise = null;
        }
      },
    );

    return operation;
  }

  async function restore():
    Promise<void> {
    const snapshot =
      sessionManager.getSnapshot();

    if (
      snapshot.status !==
      "restoring"
    ) {
      return;
    }

    try {
      await refreshSingleFlight();
    } catch (cause) {
      /*
       * A terminal refresh failure clears
       * Session intentionally.
       *
       * During restore, becoming anonymous
       * is a valid result rather than a
       * fatal application bootstrap error.
       */
      if (
        sessionManager.getSnapshot()
          .status === "anonymous"
      ) {
        return;
      }

      throw cause;
    }
  }

  async function refresh():
    Promise<string> {
    const snapshot =
      sessionManager.getSnapshot();

    if (
      snapshot.status !==
      "authenticated"
    ) {
      throw createRefreshUnavailableError();
    }

    return refreshSingleFlight();
  }

  async function clear():
    Promise<void> {
    await sessionManager.clear();
  }

  return Object.freeze({
    restore,

    refresh,

    clear,
  });
}
