import {
  queryOptions,
} from "@tanstack/react-query";

import {
  AppError,
} from "@/core/errors";

import type {
  CurrentUser,
  CurrentUserLoader,
} from "./access.types";

export const currentUserQueryKey = [
  "access",
  "current-user",
] as const;

let currentUserLoader:
  CurrentUserLoader | null =
  null;

function getCurrentUserLoader():
  CurrentUserLoader {
  if (!currentUserLoader) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code:
        "CURRENT_USER_LOADER_NOT_CONFIGURED",

      message:
        "Current user loader is not configured.",
    });
  }

  return currentUserLoader;
}

async function loadCurrentUser(
  signal?: AbortSignal,
): Promise<CurrentUser> {
  const loader =
    getCurrentUserLoader();

  return loader({
    signal,
  });
}

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey:
      currentUserQueryKey,

    queryFn: ({
      signal,
    }) =>
      loadCurrentUser(
        signal,
      ),
  });
}

export function configureCurrentUserLoader(
  loader: CurrentUserLoader,
): () => void {
  if (
    currentUserLoader !== null &&
    currentUserLoader !== loader
  ) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code:
        "CURRENT_USER_LOADER_ALREADY_CONFIGURED",

      message:
        "Current user loader is already configured.",
    });
  }

  currentUserLoader =
    loader;

  let released =
    false;

  return () => {
    if (released) {
      return;
    }

    released =
      true;

    if (
      currentUserLoader === loader
    ) {
      currentUserLoader =
        null;
    }
  };
}
