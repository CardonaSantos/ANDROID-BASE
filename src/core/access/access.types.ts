export type CurrentUserId =
  | string
  | number;

export type RoleName =
  string;

export type PermissionName =
  string;

export interface CurrentUser {
  id: CurrentUserId;

  roles:
    readonly RoleName[];

  permissions:
    readonly PermissionName[];
}

export interface CurrentUserLoadContext {
  signal?: AbortSignal;
}

export type CurrentUserLoader = (
  context: CurrentUserLoadContext,
) => Promise<CurrentUser>;
