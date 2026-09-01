import { queryClient } from "@/core/query";

import type { RealtimeEvent } from "@/core/realtime";

import {
  technicianTrackingRealtimeViewSchema,
  type TechnicianTrackingRealtimeList,
  type TechnicianTrackingRealtimeView,
} from "../api/real-time-location.contracts.api";

import { realTimeLocationQueryKeys } from "../application/real-time-location.query";

/*
 * =========================================================
 * EVENTS
 * =========================================================
 */

export const TRACKING_LOCATION_UPDATED_EVENT =
  "tracking:location-updated" as const;

/*
 * =========================================================
 * FRESHNESS
 * =========================================================
 *
 * Aunque Socket.IO conserva el orden dentro de una
 * conexión, el cache también será alimentado por el futuro
 * snapshot HTTP.
 *
 * Evitamos que una ubicación más antigua reemplace una
 * vista más reciente del técnico.
 * =========================================================
 */

function getRealtimeViewTimestamp(
  value: TechnicianTrackingRealtimeView,
): number {
  const source =
    value.ubicacion?.recibidoEn ?? value.tracking.ultimoHeartbeatEn;

  return Date.parse(source);
}

function isOlderThanCurrent(
  current: TechnicianTrackingRealtimeView,
  incoming: TechnicianTrackingRealtimeView,
): boolean {
  return getRealtimeViewTimestamp(incoming) < getRealtimeViewTimestamp(current);
}

/*
 * =========================================================
 * UPSERT
 * =========================================================
 */

function upsertTechnicianRealtimeView(
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

  if (isOlderThanCurrent(previous, incoming)) {
    return current;
  }

  const next = [...current];

  next[index] = incoming;

  return next;
}

/*
 * =========================================================
 * HANDLER
 * =========================================================
 *
 * Socket.IO entrega:
 *
 * tracking:location-updated
 *              ↓
 * RealtimeEvent.payload
 *              ↓
 * Zod boundary validation
 *              ↓
 * TanStack Query cache
 *
 * No dejamos entrar payloads no validados a la aplicación.
 * =========================================================
 */

export function handleTrackingLocationUpdated(event: RealtimeEvent): void {
  const incoming = technicianTrackingRealtimeViewSchema.parse(event.payload);

  queryClient.setQueryData<TechnicianTrackingRealtimeList>(
    realTimeLocationQueryKeys.technicians(),
    (current) => {
      /*
       * Antes de que exista/cargue el snapshot HTTP,
       * Socket.IO puede ser nuestra primera fuente.
       */
      if (!current) {
        return [incoming];
      }

      return upsertTechnicianRealtimeView(current, incoming);
    },
  );
}
