import { createStore, type StoreApi } from "zustand/vanilla";

import type {
  RealtimeSnapshot,
  RealtimeStatus,
  RealtimeSuspendReason,
} from "../realtime.types";

export interface RealtimeInternalState {
  status: RealtimeStatus;

  configured: boolean;

  suspendReason: RealtimeSuspendReason | null;

  reconnectAttempt: number;

  connectedAt: number | null;

  disconnectedAt: number | null;

  lastCloseCode: number | null;
}

export type RealtimeStore = StoreApi<RealtimeInternalState>;

export function createRealtimeStore(configured = false): RealtimeStore {
  return createStore<RealtimeInternalState>()(() => ({
    status: configured ? "idle" : "disabled",

    configured,

    suspendReason: null,

    reconnectAttempt: 0,

    connectedAt: null,

    disconnectedAt: null,

    lastCloseCode: null,
  }));
}

export function toRealtimeSnapshot(
  state: RealtimeInternalState,
): RealtimeSnapshot {
  return {
    status: state.status,

    configured: state.configured,

    suspendReason: state.suspendReason,

    reconnectAttempt: state.reconnectAttempt,

    connectedAt: state.connectedAt,

    disconnectedAt: state.disconnectedAt,

    lastCloseCode: state.lastCloseCode,
  };
}
