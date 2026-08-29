import { AppError } from "@/core/errors";

import { finishTracking, type FinishTrackingResponse } from "../api";

import { stopTrackingLocationService } from "../background";

import {
  clearActiveTrackingRuntime,
  clearQueuedTrackingLocationsForSession,
} from "../storage";

import { flushTrackingQueueForSession } from "./tracking-sync";

export interface FinishTrackingJourneyResult {
  summary: FinishTrackingResponse;

  localServiceStopped: boolean;
}

export async function finishTrackingJourney(
  sesionTrackingId: number,
): Promise<FinishTrackingJourneyResult> {
  /*
   * Antes de cerrar, intentamos entregar
   * cualquier posición aceptada que todavía
   * esté pendiente.
   *
   * Después del finish el backend ya no
   * aceptaría nuevas ubicaciones para esa
   * sesión.
   */
  const flush = await flushTrackingQueueForSession(sesionTrackingId);

  if (flush.remaining > 0) {
    throw new AppError({
      kind: flush.reason === "unauthenticated" ? "unauthorized" : "network",

      source: "application",

      code: "TRACKING_PENDING_LOCATIONS",

      message:
        "Hay ubicaciones pendientes de sincronizar antes de finalizar la jornada.",

      details: flush,
    });
  }

  /*
   * El servidor sigue siendo la fuente
   * autoritativa del cierre.
   */
  const summary = await finishTracking(sesionTrackingId);

  let localServiceStopped = true;

  try {
    await stopTrackingLocationService();
  } catch (error) {
    localServiceStopped = false;

    console.warn(
      "[tracking] La jornada fue finalizada, pero el servicio local no pudo detenerse.",
      error,
    );
  }

  /*
   * El servidor YA confirmó el cierre.
   * Un problema limpiando metadata local
   * no debe convertirlo en finish fallido.
   */
  try {
    await clearQueuedTrackingLocationsForSession(sesionTrackingId);

    await clearActiveTrackingRuntime();
  } catch (error) {
    console.warn(
      "[tracking] No se pudo limpiar completamente el runtime local.",
      error,
    );
  }

  return {
    summary,

    localServiceStopped,
  };
}
