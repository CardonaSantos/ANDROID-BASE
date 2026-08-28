export interface AuthTokenPair {
  accessToken: string;

  refreshToken?: string;
}

export interface AuthRefreshContext {
  refreshToken: string;
}

export type AuthRefreshHandler = (
  context: AuthRefreshContext,
) => Promise<AuthTokenPair>;

export interface AuthSessionCoordinator {
  restore(): Promise<void>;

  refresh(): Promise<string>;

  clear(): Promise<void>;
}

export interface CreateAuthSessionCoordinatorOptions {
  refresh: AuthRefreshHandler;
}
