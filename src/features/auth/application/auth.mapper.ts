import type { CurrentUser } from "@/core/access";

import type { AuthUser } from "../api";

export function mapAuthUserToCurrentUser(user: AuthUser): CurrentUser {
  return {
    id: user.id,

    roles: [user.rol],

    permissions: [],
  };
}
