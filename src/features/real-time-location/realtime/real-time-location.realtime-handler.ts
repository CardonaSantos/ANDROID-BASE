import { queryClient } from "@/core/query";

import type { RealtimeEvent } from "@/core/realtime";

import {
  technicianTrackingRealtimeViewSchema,
  technicianTrackingStateChangedSchema,
  type TechnicianTrackingRealtimeList,
} from "../api/real-time-location.contracts.api";

import {
  realTimeLocationQueryKeys,
  upsertTechnicianRealtimeView,
} from "../application/real-time-location.query";

/*
 * =========================================================
 * EVENTS
 * =========================================================
 */

export const TRACKING_LOCATION_UPDATED_EVENT =
  "tracking:location-updated" as const;

export const TRACKING_STATE_CHANGED_EVENT = "tracking:state-changed" as const;

/*
 * =========================================================
 * LOCATION UPDATED
 * =========================================================
 */

export function handleTrackingLocationUpdated(event: RealtimeEvent): void {
  const incoming = technicianTrackingRealtimeViewSchema.parse(event.payload);

  queryClient.setQueryData<TechnicianTrackingRealtimeList>(
    realTimeLocationQueryKeys.technicians(),

    (current) => {
      /*
       * Socket.IO puede recibir una ubicación incluso
       * antes de que el snapshot HTTP haya terminado.
       */
      if (!current) {
        return [incoming];
      }

      return upsertTechnicianRealtimeView(current, incoming);
    },
  );
}

/*
 * =========================================================
 * TRACKING STATE CHANGED
 * =========================================================
 *
 * ACTIVA
 * -------
 *
 * El evento de estado no contiene:
 *
 * - nombre;
 * - avatar;
 * - última ubicación;
 * - actividad/tickets.
 *
 * Por eso no fabricamos una TechnicianTrackingRealtimeView
 * parcial. Invalidamos el snapshot para que HTTP obtenga
 * nuevamente la representación enriquecida.
 *
 *
 * FINALIZADA / EXPIRADA
 * ---------------------
 *
 * Una sesión no activa ya no pertenece al snapshot
 * operacional del mapa y debe desaparecer de la cache.
 * =========================================================
 */

export function handleTrackingStateChanged(event: RealtimeEvent): void {
  const incoming = technicianTrackingStateChangedSchema.parse(event.payload);

  /*
   * =======================================================
   * NUEVA SESIÓN ACTIVA
   * =======================================================
   */

  if (incoming.estado === "ACTIVA") {
    void queryClient.invalidateQueries({
      queryKey: realTimeLocationQueryKeys.technicians(),
    });

    return;
  }

  /*
   * =======================================================
   * SESIÓN FINALIZADA / EXPIRADA
   * =======================================================
   *
   * Comparamos también sesionTrackingId.
   *
   * Esto evita que un evento atrasado perteneciente a una
   * sesión antigua elimine accidentalmente una sesión nueva
   * del mismo técnico.
   * =======================================================
   */

  queryClient.setQueryData<TechnicianTrackingRealtimeList>(
    realTimeLocationQueryKeys.technicians(),

    (current) => {
      if (!current) {
        return current;
      }

      return current.filter((item) => {
        const sameTechnician = item.tecnico.id === incoming.tecnicoId;

        const sameSession =
          item.tracking.sesionId === incoming.sesionTrackingId;

        return !(sameTechnician && sameSession);
      });
    },
  );
}
