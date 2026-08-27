import { useStore } from "zustand";

import { realtimeStore } from "./_internal/realtime.store";

export function useRealtimeStatus() {
  return useStore(realtimeStore, (state) => state.status);
}

export function useIsRealtimeConnected(): boolean {
  return useStore(realtimeStore, (state) => state.status === "connected");
}

export function useRealtimeSuspendReason() {
  return useStore(realtimeStore, (state) => state.suspendReason);
}

export function useRealtimeReconnectAttempt(): number {
  return useStore(realtimeStore, (state) => state.reconnectAttempt);
}
