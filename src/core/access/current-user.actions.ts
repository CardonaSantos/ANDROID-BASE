import {
  queryClient,
} from "@/core/query";

import {
  currentUserQueryKey,
} from "./current-user";

export async function invalidateCurrentUser():
  Promise<void> {
  await queryClient.invalidateQueries({
    queryKey:
      currentUserQueryKey,

    exact:
      true,
  });
}

export function removeCurrentUser():
  void {
  queryClient.removeQueries({
    queryKey:
      currentUserQueryKey,

    exact:
      true,
  });
}
