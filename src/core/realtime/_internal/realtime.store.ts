import { createStore } from "zustand/vanilla";

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

export const realtimeStore = createStore<RealtimeInternalState>()(() => ({
  status: "idle",

  configured: false,

  suspendReason: null,

  reconnectAttempt: 0,

  connectedAt: null,

  disconnectedAt: null,

  lastCloseCode: null,
}));

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
