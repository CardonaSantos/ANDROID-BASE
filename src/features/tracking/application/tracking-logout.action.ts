import { getMyTrackingState } from "../api/tracking.api";

import { stopTrackingLocationService } from "../background/tracking-service";

import { clearQueuedTrackingLocationsForSession } from "../storage/tracking-queue";

import {
  clearActiveTrackingRuntime,
  readActiveTrackingSessionId,
} from "../storage/tracking-runtime.storage";

import { finishTrackingJourney } from "./finish-tracking.action";

/**
 * Prepara el módulo de tracking antes
 * de permitir que Auth elimine el JWT.
 *
 * Regla principal:
 *
 * Nunca borrar la sesión autenticada
 * antes de haber resuelto una jornada
 * activa en el backend.
 */
export async function prepareTrackingForLogout(): Promise<void> {
  /*
   * El backend es la fuente autoritativa.
   *
   * Si esta consulta falla, dejamos que
   * el error suba y BLOQUEAMOS el logout.
   *
   * Es preferible conservar el JWT a
   * perder la posibilidad de finalizar
   * correctamente una jornada activa.
   */
  const serverState = await getMyTrackingState();

  /*
   * =====================================================
   * JORNADA ACTIVA
   * =====================================================
   */

  if (serverState.activo) {
    /*
     * finishTrackingJourney ya se ocupa de:
     *
     * - flush de ubicaciones pendientes
     * - POST finish
     * - detener foreground service
     * - limpiar queue
     * - limpiar runtime local
     */
    await finishTrackingJourney(serverState.sesionTrackingId);

    return;
  }

  /*
   * =====================================================
   * SIN JORNADA EN SERVIDOR
   * =====================================================
   *
   * Puede haber quedado basura local por:
   *
   * - cierre remoto
   * - expiración
   * - proceso interrumpido
   * - recuperación incompleta
   */

  const localSessionId = await readActiveTrackingSessionId();

  /*
   * Si el servidor dice que no existe
   * jornada, el servicio local ya no
   * tiene razón para continuar.
   */
  try {
    await stopTrackingLocationService();
  } catch (error) {
    console.warn(
      "[tracking] No se pudo detener el servicio local durante logout.",
      error,
    );
  }

  /*
   * Los puntos de una jornada que ya
   * no está activa en servidor tampoco
   * podrán ser aceptados posteriormente.
   */
  if (localSessionId) {
    try {
      await clearQueuedTrackingLocationsForSession(localSessionId);
    } catch (error) {
      console.warn(
        "[tracking] No se pudo limpiar la cola local durante logout.",
        error,
      );
    }
  }

  try {
    await clearActiveTrackingRuntime();
  } catch (error) {
    console.warn(
      "[tracking] No se pudo limpiar completamente el runtime durante logout.",
      error,
    );
  }
}
