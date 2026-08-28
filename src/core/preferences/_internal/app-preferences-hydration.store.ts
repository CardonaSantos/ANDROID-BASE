import {
  createStore,
} from "zustand/vanilla";

import {
  toAppError,
  type AppError,
} from "@/core/errors";

import type {
  AppPreferencesHydrationStatus,
} from "../app-preferences.types";

interface AppPreferencesHydrationState {
  status:
    AppPreferencesHydrationStatus;

  error:
    AppError | null;
}

export const appPreferencesHydrationStore =
  createStore<AppPreferencesHydrationState>(
    () => ({
      status:
        "hydrating",

      error:
        null,
    }),
  );

export function markAppPreferencesHydrating():
  void {
  appPreferencesHydrationStore.setState({
    status:
      "hydrating",

    error:
      null,
  });
}

export function markAppPreferencesHydrated():
  void {
  appPreferencesHydrationStore.setState({
    status:
      "hydrated",

    error:
      null,
  });
}

export function markAppPreferencesHydrationError(
  cause: unknown,
): void {
  appPreferencesHydrationStore.setState({
    status:
      "error",

    error:
      toAppError(
        cause,
        {
          kind: "storage",

          source: "storage",

          code:
            "APP_PREFERENCES_HYDRATION_FAILED",

          message:
            "Unable to hydrate application preferences.",
        },
      ),
  });
}
