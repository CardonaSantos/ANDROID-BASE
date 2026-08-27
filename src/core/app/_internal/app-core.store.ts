import { createStore } from "zustand/vanilla";

import type { AppCoreSnapshot, AppCoreStatus } from "../app-core.types";

import type { AppError } from "@/core/errors";

export interface AppCoreInternalState {
  status: AppCoreStatus;

  error: AppError | null;
}

export const appCoreStore = createStore<AppCoreInternalState>()(() => ({
  status: "idle",

  error: null,
}));

export function toAppCoreSnapshot(
  state: AppCoreInternalState,
): AppCoreSnapshot {
  return {
    status: state.status,

    error: state.error,
  };
}
