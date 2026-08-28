import {
  useQuery,
} from "@tanstack/react-query";

import {
  useIsAuthenticated,
} from "@/core/session";

import {
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from "./access.utils";

import {
  currentUserQueryOptions,
} from "./current-user";

import type {
  CurrentUser,
  PermissionName,
  RoleName,
} from "./access.types";

export function useCurrentUserQuery() {
  const isAuthenticated =
    useIsAuthenticated();

  return useQuery({
    ...currentUserQueryOptions(),

    enabled:
      isAuthenticated,
  });
}

export function useCurrentUser():
  CurrentUser | null {
  const isAuthenticated =
    useIsAuthenticated();

  const query =
    useCurrentUserQuery();

  if (!isAuthenticated) {
    return null;
  }

  return query.data ?? null;
}

export function useCurrentUserHasRole(
  role: RoleName,
): boolean {
  const user =
    useCurrentUser();

  return hasRole(
    user,
    role,
  );
}

export function useCurrentUserHasAnyRole(
  roles: readonly RoleName[],
): boolean {
  const user =
    useCurrentUser();

  return hasAnyRole(
    user,
    roles,
  );
}

export function useCurrentUserHasAllRoles(
  roles: readonly RoleName[],
): boolean {
  const user =
    useCurrentUser();

  return hasAllRoles(
    user,
    roles,
  );
}

export function useCurrentUserHasPermission(
  permission:
    PermissionName,
): boolean {
  const user =
    useCurrentUser();

  return hasPermission(
    user,
    permission,
  );
}

export function useCurrentUserHasAnyPermission(
  permissions:
    readonly PermissionName[],
): boolean {
  const user =
    useCurrentUser();

  return hasAnyPermission(
    user,
    permissions,
  );
}

export function useCurrentUserHasAllPermissions(
  permissions:
    readonly PermissionName[],
): boolean {
  const user =
    useCurrentUser();

  return hasAllPermissions(
    user,
    permissions,
  );
}
