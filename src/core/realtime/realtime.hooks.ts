import { useSyncExternalStore } from "react";

import { realtimeClient } from "./realtime-client";

import type { RealtimeStatus, RealtimeSuspendReason } from "./realtime.types";

function subscribe(onStoreChange: () => void): () => void {
  return realtimeClient.subscribeState(() => {
    onStoreChange();
  });
}

function getStatus(): RealtimeStatus {
  return realtimeClient.getSnapshot().status;
}

function getSuspendReason(): RealtimeSuspendReason | null {
  return realtimeClient.getSnapshot().suspendReason;
}

function getReconnectAttempt(): number {
  return realtimeClient.getSnapshot().reconnectAttempt;
}

function getIsConnected(): boolean {
  return realtimeClient.getSnapshot().status === "connected";
}

export function useRealtimeStatus(): RealtimeStatus {
  return useSyncExternalStore(subscribe, getStatus, getStatus);
}

export function useIsRealtimeConnected(): boolean {
  return useSyncExternalStore(subscribe, getIsConnected, getIsConnected);
}

export function useRealtimeSuspendReason(): RealtimeSuspendReason | null {
  return useSyncExternalStore(subscribe, getSuspendReason, getSuspendReason);
}

export function useRealtimeReconnectAttempt(): number {
  return useSyncExternalStore(
    subscribe,
    getReconnectAttempt,
    getReconnectAttempt,
  );
}
