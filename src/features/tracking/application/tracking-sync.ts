import { isNetworkUsable, networkManager } from "@/core/network";

import { sessionManager } from "@/core/session";

import { registerTrackingLocation } from "../api/tracking.api";

import {
  countQueuedTrackingLocationsForSession,
  deleteQueuedTrackingLocation,
  listQueuedTrackingLocationsForSession,
  markQueuedTrackingLocationAttempt,
  saveTrackingSyncSuccess,
} from "../storage";

export type TrackingQueueFlushReason =
  | "completed"
  | "offline"
  | "unauthenticated"
  | "request-failed";

export interface TrackingQueueFlushResult {
  sent: number;

  remaining: number;

  reason: TrackingQueueFlushReason;
}

async function ensureAuthenticatedSession(): Promise<boolean> {
  let snapshot = sessionManager.getSnapshot();

  /*
   * Una ejecución headless puede arrancar
   * sin que React haya hidratado todavía
   * la sesión.
   */
  if (!snapshot.hydrated) {
    try {
      await sessionManager.hydrate();
    } catch {
      return false;
    }

    snapshot = sessionManager.getSnapshot();
  }

  return snapshot.isAuthenticated;
}

export async function flushTrackingQueueForSession(
  sessionId: number,
): Promise<TrackingQueueFlushResult> {
  const initialPending =
    await countQueuedTrackingLocationsForSession(sessionId);

  if (initialPending === 0) {
    return {
      sent: 0,

      remaining: 0,

      reason: "completed",
    };
  }

  let network;

  try {
    network = await networkManager.refreshConnectivity();
  } catch {
    return {
      sent: 0,

      remaining: initialPending,

      reason: "offline",
    };
  }

  if (!isNetworkUsable(network)) {
    return {
      sent: 0,

      remaining: initialPending,

      reason: "offline",
    };
  }

  const authenticated = await ensureAuthenticatedSession();

  if (!authenticated) {
    return {
      sent: 0,

      remaining: initialPending,

      reason: "unauthenticated",
    };
  }

  /*
   * Procesamos de forma secuencial.
   *
   * El backend todavía no posee una
   * clave de idempotencia para ubicación,
   * por lo que evitamos retries paralelos
   * o agresivos.
   */
  const pending = await listQueuedTrackingLocationsForSession(sessionId, 25);

  let sent = 0;

  for (const item of pending) {
    await markQueuedTrackingLocationAttempt(item.id);

    let response;

    try {
      response = await registerTrackingLocation(item.payload);
    } catch {
      return {
        sent,

        remaining: await countQueuedTrackingLocationsForSession(sessionId),

        reason: "request-failed",
      };
    }

    /*
     * ACK confirmado.
     *
     * A partir de aquí el servidor ya
     * persistió esta ubicación.
     */
    await deleteQueuedTrackingLocation(item.id);

    /*
     * Estos metadatos son informativos.
     * Un fallo guardándolos no debe volver
     * a insertar una ubicación que ya tuvo ACK.
     */
    try {
      await saveTrackingSyncSuccess({
        receivedAt: response.recibidoEn,

        heartbeatAt: response.ultimoHeartbeatEn,
      });
    } catch (error) {
      console.warn(
        "[tracking-sync] No se pudo persistir metadata de sincronización.",
        error,
      );
    }

    sent += 1;
  }

  return {
    sent,

    remaining: await countQueuedTrackingLocationsForSession(sessionId),

    reason: "completed",
  };
}
