import {
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
} from "@/core/access";

import type {
  CurrentUser,
} from "@/core/access";

import type {
  RouteAccessRequirement,
} from "./routing.types";

export function routeRequiresCurrentUser(
  requirement:
    RouteAccessRequirement = {},
): boolean {
  return (
    requirement.roles !==
      undefined ||
    requirement.permissions !==
      undefined
  );
}

export function evaluateRouteAccess(
  user: CurrentUser,
  requirement:
    RouteAccessRequirement = {},
): boolean {
  if (
    requirement.roles !==
    undefined
  ) {
    const allowedByRole =
      requirement.roleMatch ===
      "any"
        ? hasAnyRole(
            user,
            requirement.roles,
          )
        : hasAllRoles(
            user,
            requirement.roles,
          );

    if (!allowedByRole) {
      return false;
    }
  }

  if (
    requirement.permissions !==
    undefined
  ) {
    const allowedByPermission =
      requirement.permissionMatch ===
      "any"
        ? hasAnyPermission(
            user,
            requirement.permissions,
          )
        : hasAllPermissions(
            user,
            requirement.permissions,
          );

    if (!allowedByPermission) {
      return false;
    }
  }

  return true;
}
