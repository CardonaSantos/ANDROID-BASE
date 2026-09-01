import type { AppError } from "@/core/errors";

import type { AccessTokenProvider } from "@/core/session";

/*
 * =========================================================
 * STATUS
 * =========================================================
 */

export type RealtimeStatus =
  | "disabled"
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "suspended";

export type RealtimeSuspendReason =
  | "session_unavailable"
  | "offline"
  | "background";

/*
 * =========================================================
 * AUTH
 * =========================================================
 */

export type RealtimeAuthMode = "none" | "bearer-header";

/*
 * =========================================================
 * EVENTS
 * =========================================================
 *
 * Este contrato permanece independiente del transporte.
 *
 * Socket.IO:
 *
 * socket.emit(
 *   "tracking:location-updated",
 *   payload,
 * )
 *
 * se representa internamente como:
 *
 * {
 *   type: "tracking:location-updated",
 *   payload
 * }
 *
 * Los features no necesitan conocer Socket.IO.
 * =========================================================
 */

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

/*
 * =========================================================
 * SNAPSHOT
 * =========================================================
 */

export interface RealtimeSnapshot {
  status: RealtimeStatus;

  configured: boolean;

  suspendReason: RealtimeSuspendReason | null;

  reconnectAttempt: number;

  connectedAt: number | null;

  disconnectedAt: number | null;
}
/*
 * =========================================================
 * MANAGER OPTIONS
 * =========================================================
 */

export interface CreateRealtimeManagerOptions {
  /*
   * Origen HTTP(S) del servidor Socket.IO.
   *
   * Ejemplo:
   *
   * https://api.example.com
   *
   * El manager agrega:
   *
   * namespace /ws
   * path      /socket.io
   */
  url: string | null;

  authMode: RealtimeAuthMode;

  tokenProvider?: AccessTokenProvider;

  connectionTimeoutMs?: number;
}

/*
 * =========================================================
 * LISTENERS
 * =========================================================
 */

export type RealtimeEventListener = (event: RealtimeEvent) => void;

export type RealtimeErrorListener = (error: AppError) => void;
