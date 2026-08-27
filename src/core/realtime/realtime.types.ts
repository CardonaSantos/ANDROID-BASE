import type { AccessTokenProvider } from "@/core/session";

export type RealtimeStatus =
  | "disabled"
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "suspended";

export type RealtimeSuspendReason =
  | "runtime_stopped"
  | "session_unavailable"
  | "offline"
  | "background";

export type RealtimeAuthMode = "none" | "bearer-header";

export interface RealtimeEvent {
  type: string;

  payload: unknown;

  id?: string;
}

export interface RealtimeOutgoingEvent {
  type: string;

  payload?: unknown;

  id?: string;
}

export interface RealtimeSnapshot {
  status: RealtimeStatus;

  configured: boolean;

  suspendReason: RealtimeSuspendReason | null;

  reconnectAttempt: number;

  connectedAt: number | null;

  disconnectedAt: number | null;

  lastCloseCode: number | null;
}

export interface RealtimeCodec {
  decode(data: unknown): RealtimeEvent;

  encode(event: RealtimeOutgoingEvent): string;
}

export interface CreateRealtimeManagerOptions {
  url: string | null;

  authMode: RealtimeAuthMode;

  tokenProvider?: AccessTokenProvider;

  protocols?: readonly string[];

  connectionTimeoutMs?: number;

  codec: RealtimeCodec;
}

export type RealtimeEventListener = (event: RealtimeEvent) => void;

export type RealtimeErrorListener = (error: Error) => void;
