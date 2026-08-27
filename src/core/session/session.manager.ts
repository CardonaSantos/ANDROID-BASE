import { createSessionError } from "./session.error";

import {
  clearPersistedSession,
  persistAccessToken,
  persistRefreshToken,
  readPersistedSession,
} from "./session.storage";

import { enqueueSessionOperation } from "./_internal/session-operation-queue";

import {
  sessionStore,
  type SessionInternalState,
} from "./_internal/session.store";

import type {
  CompleteSessionRestoreInput,
  EstablishSessionInput,
  SessionSnapshot,
  UpdateSessionTokensInput,
} from "./session.types";

function assertToken(token: string): string {
  if (typeof token !== "string" || token.trim().length === 0) {
    throw createSessionError(
      "SESSION_INVALID_TOKEN",
      "Session token cannot be empty.",
    );
  }

  return token;
}

function createAnonymousState(): SessionInternalState {
  return {
    status: "anonymous",

    hydrated: true,

    accessToken: null,

    refreshToken: null,

    persistenceStrategy: null,
  };
}

function toSnapshot(state: SessionInternalState): SessionSnapshot {
  return {
    status: state.status,

    hydrated: state.hydrated,

    isAuthenticated: state.status === "authenticated",

    isRestoring: state.status === "restoring",

    persistenceStrategy: state.persistenceStrategy,

    hasRefreshToken: state.refreshToken !== null,
  };
}

async function hydrate(): Promise<void> {
  return enqueueSessionOperation(async () => {
    if (sessionStore.getState().hydrated) {
      return;
    }

    try {
      const persisted = await readPersistedSession();

      if (!persisted) {
        sessionStore.setState(createAnonymousState());

        return;
      }

      if (persisted.strategy === "refresh-token") {
        sessionStore.setState({
          status: "restoring",

          hydrated: true,

          accessToken: null,

          refreshToken: persisted.refreshToken,

          persistenceStrategy: "refresh-token",
        });

        return;
      }

      sessionStore.setState({
        status: "authenticated",

        hydrated: true,

        accessToken: persisted.accessToken,

        refreshToken: null,

        persistenceStrategy: "access-token",
      });
    } catch (error) {
      sessionStore.setState(createAnonymousState());

      throw error;
    }
  });
}

async function establish(input: EstablishSessionInput): Promise<void> {
  return enqueueSessionOperation(async () => {
    const state = sessionStore.getState();

    if (!state.hydrated) {
      throw createSessionError(
        "SESSION_INVALID_TRANSITION",
        "Session must be hydrated before authentication.",
      );
    }

    const accessToken = assertToken(input.accessToken);

    const { persistence } = input;

    switch (persistence.strategy) {
      case "none": {
        await clearPersistedSession();

        sessionStore.setState({
          status: "authenticated",

          hydrated: true,

          accessToken,

          refreshToken: null,

          persistenceStrategy: "none",
        });

        return;
      }

      case "access-token": {
        await persistAccessToken(accessToken);

        sessionStore.setState({
          status: "authenticated",

          hydrated: true,

          accessToken,

          refreshToken: null,

          persistenceStrategy: "access-token",
        });

        return;
      }

      case "refresh-token": {
        const refreshToken = assertToken(persistence.refreshToken);

        await persistRefreshToken(refreshToken);

        sessionStore.setState({
          status: "authenticated",

          hydrated: true,

          accessToken,

          refreshToken,

          persistenceStrategy: "refresh-token",
        });
      }
    }
  });
}

async function completeRestore(
  input: CompleteSessionRestoreInput,
): Promise<void> {
  return enqueueSessionOperation(async () => {
    const state = sessionStore.getState();

    if (
      state.status !== "restoring" ||
      state.persistenceStrategy !== "refresh-token" ||
      !state.refreshToken
    ) {
      throw createSessionError(
        "SESSION_INVALID_TRANSITION",
        "There is no session restore in progress.",
      );
    }

    const accessToken = assertToken(input.accessToken);

    let refreshToken = state.refreshToken;

    if (input.refreshToken !== undefined) {
      refreshToken = assertToken(input.refreshToken);

      await persistRefreshToken(refreshToken);
    }

    sessionStore.setState({
      status: "authenticated",

      hydrated: true,

      accessToken,

      refreshToken,

      persistenceStrategy: "refresh-token",
    });
  });
}

async function updateTokens(input: UpdateSessionTokensInput): Promise<void> {
  return enqueueSessionOperation(async () => {
    const state = sessionStore.getState();

    if (state.status !== "authenticated") {
      throw createSessionError(
        "SESSION_INVALID_TRANSITION",
        "Cannot update tokens without an authenticated session.",
      );
    }

    const accessToken = assertToken(input.accessToken);

    switch (state.persistenceStrategy) {
      case "refresh-token": {
        if (!state.refreshToken) {
          throw createSessionError(
            "SESSION_INVALID_TRANSITION",
            "Refresh-token session has no refresh token.",
          );
        }

        let refreshToken = state.refreshToken;

        if (input.refreshToken !== undefined) {
          refreshToken = assertToken(input.refreshToken);

          await persistRefreshToken(refreshToken);
        }

        sessionStore.setState({
          ...state,

          accessToken,

          refreshToken,
        });

        return;
      }

      case "access-token": {
        await persistAccessToken(accessToken);

        sessionStore.setState({
          ...state,

          accessToken,
        });

        return;
      }

      case "none": {
        sessionStore.setState({
          ...state,

          accessToken,

          refreshToken: null,
        });

        return;
      }

      default: {
        throw createSessionError(
          "SESSION_INVALID_TRANSITION",
          "Authenticated session has no persistence strategy.",
        );
      }
    }
  });
}

async function clear(): Promise<void> {
  return enqueueSessionOperation(async () => {
    // Immediately revoke the
    // credential from runtime users
    // such as HTTP and realtime.
    sessionStore.setState(createAnonymousState());

    await clearPersistedSession();
  });
}

function getRefreshToken(): string | null {
  return sessionStore.getState().refreshToken;
}

function getSnapshot(): SessionSnapshot {
  return toSnapshot(sessionStore.getState());
}

function subscribe(listener: (snapshot: SessionSnapshot) => void): () => void {
  return sessionStore.subscribe((state) => {
    listener(toSnapshot(state));
  });
}

export const sessionManager = Object.freeze({
  hydrate,

  establish,

  completeRestore,

  updateTokens,

  clear,

  getRefreshToken,

  getSnapshot,

  subscribe,
});
