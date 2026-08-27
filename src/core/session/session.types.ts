export type SessionStatus =
  | "hydrating"
  | "anonymous"
  | "restoring"
  | "authenticated";

export type SessionPersistenceStrategy =
  | "none"
  | "access-token"
  | "refresh-token";

export type SessionPersistence =
  | {
      strategy: "none";
    }
  | {
      strategy: "access-token";
    }
  | {
      strategy: "refresh-token";
      refreshToken: string;
    };

export interface EstablishSessionInput {
  accessToken: string;
  persistence: SessionPersistence;
}

export interface CompleteSessionRestoreInput {
  accessToken: string;
  refreshToken?: string;
}

export interface UpdateSessionTokensInput {
  accessToken: string;
  refreshToken?: string;
}

export interface SessionSnapshot {
  status: SessionStatus;

  hydrated: boolean;

  isAuthenticated: boolean;

  isRestoring: boolean;

  persistenceStrategy: SessionPersistenceStrategy | null;

  hasRefreshToken: boolean;
}

export interface AccessTokenProvider {
  getAccessToken(): string | null;

  subscribe(listener: (token: string | null) => void): () => void;
}
