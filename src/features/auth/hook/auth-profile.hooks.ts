import { useQuery } from "@tanstack/react-query";

import { useIsAuthenticated } from "@/core/session";
import { authProfileQueryOptions } from "../application/auth-profile.query";

export function useAuthProfileQuery() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...authProfileQueryOptions(),

    enabled: isAuthenticated,
  });
}
