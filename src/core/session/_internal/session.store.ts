import { createStore } from "zustand/vanilla";

import type {
  SessionPersistenceStrategy,
  SessionStatus,
} from "../session.types";

export interface SessionInternalState {
  status: SessionStatus;

  hydrated: boolean;

  accessToken: string | null;

  refreshToken: string | null;

  persistenceStrategy: SessionPersistenceStrategy | null;
}

export const sessionStore = createStore<SessionInternalState>()(() => ({
  status: "hydrating",

  hydrated: false,

  accessToken: null,

  refreshToken: null,

  persistenceStrategy: null,
}));
