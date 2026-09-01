import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import {
  technicianTrackingRealtimeListSchema,
  type TechnicianTrackingRealtimeList,
} from "./real-time-location.contracts.api";

/*
 * =========================================================
 * ENDPOINTS
 * =========================================================
 */

const REAL_TIME_LOCATION_ENDPOINTS = {
  trackingRealtime: "real-time-location/tracking/realtime",
} as const;

/*
 * =========================================================
 * RESPONSE PARSING
 * =========================================================
 *
 * HTTP es una frontera externa igual que Socket.IO.
 *
 * Aunque httpClient transporte correctamente la respuesta,
 * el payload sigue siendo desconocido hasta validarlo.
 * =========================================================
 */

function parseTechnicianTrackingRealtimeList(
  payload: unknown,
): TechnicianTrackingRealtimeList {
  const result = technicianTrackingRealtimeListSchema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",

      source: "application",

      code: "REAL_TIME_LOCATION_INVALID_REALTIME_SNAPSHOT",

      message:
        "El servidor devolvió un snapshot de ubicación en tiempo real inválido.",

      details: result.error.issues,
    });
  }

  return result.data;
}

/*
 * =========================================================
 * GET REALTIME TRACKING SNAPSHOT
 * =========================================================
 *
 * Fuente inicial del mapa:
 *
 * HTTP snapshot
 *      ↓
 * TechnicianTrackingRealtimeList
 *
 * Después de cargarlo, Socket.IO mantiene esa misma vista
 * actualizada mediante tracking:location-updated.
 * =========================================================
 */

export async function getTechnicianTrackingRealtime(
  signal?: AbortSignal,
): Promise<TechnicianTrackingRealtimeList> {
  const payload = await httpClient.request<unknown>({
    method: "GET",

    path: REAL_TIME_LOCATION_ENDPOINTS.trackingRealtime,

    auth: "auto",

    signal,
  });

  return parseTechnicianTrackingRealtimeList(payload);
}
