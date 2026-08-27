import { useStore } from "zustand";

import { sessionStore } from "./_internal/session.store";

import type { SessionStatus } from "./session.types";

export function useSessionStatus(): SessionStatus {
  return useStore(sessionStore, (state) => state.status);
}

export function useSessionHydrated(): boolean {
  return useStore(sessionStore, (state) => state.hydrated);
}

export function useIsAuthenticated(): boolean {
  return useStore(sessionStore, (state) => state.status === "authenticated");
}

export function useIsSessionRestoring(): boolean {
  return useStore(sessionStore, (state) => state.status === "restoring");
}

export function useIsSessionSettled(): boolean {
  return useStore(
    sessionStore,
    (state) => state.hydrated && state.status !== "restoring",
  );
}
