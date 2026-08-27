import { useStore } from "zustand";

import { appCoreStore } from "./_internal/app-core.store";

import type { AppCoreStatus } from "./app-core.types";

import type { AppError } from "@/core/errors";

export function useAppCoreStatus(): AppCoreStatus {
  return useStore(appCoreStore, (state) => state.status);
}

export function useIsAppCoreReady(): boolean {
  return useStore(appCoreStore, (state) => state.status === "ready");
}

export function useIsAppCoreBooting(): boolean {
  return useStore(
    appCoreStore,
    (state) => state.status === "idle" || state.status === "booting",
  );
}

export function useAppCoreError(): AppError | null {
  return useStore(appCoreStore, (state) => state.error);
}
