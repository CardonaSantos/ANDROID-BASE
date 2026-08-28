export {
  configureCurrentUserLoader,
  currentUserQueryKey,
  currentUserQueryOptions,
} from "./current-user";

export {
  invalidateCurrentUser,
  removeCurrentUser,
} from "./current-user.actions";

export {
  useCurrentUser,
  useCurrentUserHasAllPermissions,
  useCurrentUserHasAllRoles,
  useCurrentUserHasAnyPermission,
  useCurrentUserHasAnyRole,
  useCurrentUserHasPermission,
  useCurrentUserHasRole,
  useCurrentUserQuery,
} from "./current-user.hooks";

export {
  hasAllPermissions,
  hasAllRoles,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from "./access.utils";

export type {
  CurrentUser,
  CurrentUserId,
  CurrentUserLoadContext,
  CurrentUserLoader,
  PermissionName,
  RoleName,
} from "./access.types";
