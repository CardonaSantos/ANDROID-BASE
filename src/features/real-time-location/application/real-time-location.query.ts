import { useQuery } from "@tanstack/react-query";

import { getTechnicianTrackingRealtime } from "../api/real-time-location.api";

import type {
  TechnicianTrackingRealtimeList,
  TechnicianTrackingRealtimeView,
} from "../api/real-time-location.contracts.api";

/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const realTimeLocationQueryKeys = {
  all: ["real-time-location"] as const,

  realtime: () => [...realTimeLocationQueryKeys.all, "realtime"] as const,

  technicians: () =>
    [...realTimeLocationQueryKeys.realtime(), "technicians"] as const,
};

/*
 * =========================================================
 * FRESHNESS
 * =========================================================
 *
 * Tanto HTTP como Socket.IO escriben sobre la misma vista.
 *
 * La fecha preferida es recibidoEn porque representa
 * cuándo el backend recibió/persistió esa posición.
 *
 * Si todavía no hay ubicación, usamos el heartbeat
 * de la sesión.
 * =========================================================
 */

export function getTechnicianRealtimeTimestamp(
  value: TechnicianTrackingRealtimeView,
): number {
  const source =
    value.ubicacion?.recibidoEn ?? value.tracking.ultimoHeartbeatEn;

  const timestamp = Date.parse(source);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/*
 * =========================================================
 * UPSERT
 * =========================================================
 */

export function upsertTechnicianRealtimeView(
  current: TechnicianTrackingRealtimeList,
  incoming: TechnicianTrackingRealtimeView,
): TechnicianTrackingRealtimeList {
  const index = current.findIndex(
    (item) => item.tecnico.id === incoming.tecnico.id,
  );

  if (index === -1) {
    return [...current, incoming];
  }

  const previous = current[index];

  const previousTimestamp = getTechnicianRealtimeTimestamp(previous);

  const incomingTimestamp = getTechnicianRealtimeTimestamp(incoming);

  /*
   * Nunca dejamos que una representación más antigua
   * reemplace una más reciente.
   */
  if (incomingTimestamp < previousTimestamp) {
    return current;
  }

  const next = [...current];

  next[index] = incoming;

  return next;
}

/*
 * =========================================================
 * SNAPSHOT + CACHE MERGE
 * =========================================================
 *
 * Caso importante:
 *
 * 1. empieza GET snapshot;
 * 2. Socket.IO recibe una ubicación más nueva;
 * 3. termina GET snapshot.
 *
 * El HTTP no debe pisar la posición nueva.
 *
 * Partimos del snapshot y reinsertamos la cache actual.
 * El upsert decide cuál representación es más reciente.
 * =========================================================
 */

export function mergeTechnicianRealtimeSnapshot(
  current: TechnicianTrackingRealtimeList | undefined,
  snapshot: TechnicianTrackingRealtimeList,
): TechnicianTrackingRealtimeList {
  if (!current || current.length === 0) {
    return snapshot;
  }

  let merged: TechnicianTrackingRealtimeList = snapshot;

  for (const cached of current) {
    merged = upsertTechnicianRealtimeView(merged, cached);
  }

  return merged;
}

/*
 * =========================================================
 * REALTIME TECHNICIANS QUERY
 * =========================================================
 */

export function useTechnicianTrackingRealtimeQuery(enabled = true) {
  return useQuery({
    queryKey: realTimeLocationQueryKeys.technicians(),

    queryFn: ({ signal }) => getTechnicianTrackingRealtime(signal),

    enabled,

    /*
     * El Socket mantiene esta cache caliente.
     *
     * No necesitamos estar golpeando constantemente
     * el snapshot HTTP.
     */
    staleTime: 30_000,

    retry: 1,

    /*
     * TanStack ejecuta structuralSharing cuando intenta
     * comprometer la respuesta HTTP en cache.
     *
     * Aprovechamos ese punto para compararla con cualquier
     * dato que Socket.IO haya escrito mientras esperaba HTTP.
     */
    structuralSharing: (oldData, newData) =>
      mergeTechnicianRealtimeSnapshot(
        oldData as TechnicianTrackingRealtimeList | undefined,

        newData as TechnicianTrackingRealtimeList,
      ),
  });
}
