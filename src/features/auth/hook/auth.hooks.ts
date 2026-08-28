import { useMutation } from "@tanstack/react-query";

import { login, logout } from "../application";

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],

    mutationFn: login,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["auth", "logout"],

    mutationFn: logout,
  });
}
