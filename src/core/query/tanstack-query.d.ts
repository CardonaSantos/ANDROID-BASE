import type { AppError } from "@/core/errors";

import type { AppMutationKey, AppQueryKey } from "./query.types";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AppError;

    queryKey: AppQueryKey;

    mutationKey: AppMutationKey;
  }
}
