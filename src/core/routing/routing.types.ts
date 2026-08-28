import type {
  PermissionName,
  RoleName,
} from "@/core/access";

export type RouteAccessMatch =
  | "all"
  | "any";

export interface RouteAccessRequirement {
  roles?: readonly RoleName[];

  permissions?:
    readonly PermissionName[];

  roleMatch?:
    RouteAccessMatch;

  permissionMatch?:
    RouteAccessMatch;
}

export type RouteAccessStatus =
  | "checking"
  | "allowed"
  | "unauthenticated"
  | "forbidden"
  | "error";

export interface SessionRouteGuards {
  isSettled: boolean;

  isAuthenticated: boolean;

  authenticatedGuard:
    boolean;

  guestGuard:
    boolean;
}

export interface RouteAccessResult {
  status:
    RouteAccessStatus;

  allowed:
    boolean;

  isChecking:
    boolean;

  isAuthenticated:
    boolean;

  requiresCurrentUser:
    boolean;

  error:
    unknown | null;
}
