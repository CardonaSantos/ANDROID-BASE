import type {
  CurrentUser,
  PermissionName,
  RoleName,
} from "./access.types";

export function hasRole(
  user: CurrentUser | null | undefined,
  role: RoleName,
): boolean {
  if (!user) {
    return false;
  }

  return user.roles.includes(role);
}

export function hasAnyRole(
  user: CurrentUser | null | undefined,
  roles: readonly RoleName[],
): boolean {
  if (!user || roles.length === 0) {
    return false;
  }

  return roles.some((role) =>
    user.roles.includes(role),
  );
}

export function hasAllRoles(
  user: CurrentUser | null | undefined,
  roles: readonly RoleName[],
): boolean {
  if (!user || roles.length === 0) {
    return false;
  }

  return roles.every((role) =>
    user.roles.includes(role),
  );
}

export function hasPermission(
  user: CurrentUser | null | undefined,
  permission: PermissionName,
): boolean {
  if (!user) {
    return false;
  }

  return user.permissions.includes(
    permission,
  );
}

export function hasAnyPermission(
  user: CurrentUser | null | undefined,
  permissions:
    readonly PermissionName[],
): boolean {
  if (
    !user ||
    permissions.length === 0
  ) {
    return false;
  }

  return permissions.some(
    (permission) =>
      user.permissions.includes(
        permission,
      ),
  );
}

export function hasAllPermissions(
  user: CurrentUser | null | undefined,
  permissions:
    readonly PermissionName[],
): boolean {
  if (
    !user ||
    permissions.length === 0
  ) {
    return false;
  }

  return permissions.every(
    (permission) =>
      user.permissions.includes(
        permission,
      ),
  );
}
