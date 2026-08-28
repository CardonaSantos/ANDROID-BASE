import { currentUserQueryKey, removeCurrentUser } from "@/core/access";

import { queryClient } from "@/core/query";

import { sessionManager } from "@/core/session";

import { loginUser, type AuthUser, type LoginCredentials } from "../api";

import { mapAuthUserToCurrentUser } from "./auth.mapper";

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await loginUser(credentials);

  await sessionManager.establish({
    accessToken: response.accessToken,

    persistence: {
      strategy: "access-token",
    },
  });

  const currentUser = mapAuthUserToCurrentUser(response.user);

  queryClient.setQueryData(currentUserQueryKey, currentUser);

  return response.user;
}

export async function logout(): Promise<void> {
  await sessionManager.clear();

  removeCurrentUser();
}
