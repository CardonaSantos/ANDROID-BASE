import {
  createRealtimeFeatureBinding,
  type RealtimeFeatureBinding,
} from "@/core/realtime/realtime-handlers";

import {
  handleTrackingLocationUpdated,
  handleTrackingStateChanged,
  TRACKING_LOCATION_UPDATED_EVENT,
  TRACKING_STATE_CHANGED_EVENT,
} from "./real-time-location.realtime-handler";

/*
 * =========================================================
 * REALTIME BINDING
 * =========================================================
 *
 * El feature escucha dos familias de eventos:
 *
 * tracking:location-updated
 *   → actualiza la representación enriquecida del técnico.
 *
 * tracking:state-changed
 *   → sincroniza el ciclo de vida de la sesión.
 *
 * Core continúa siendo responsable únicamente
 * del transporte Socket.IO.
 * =========================================================
 */

export const realTimeLocationRealtimeBinding: RealtimeFeatureBinding =
  createRealtimeFeatureBinding({
    handlers: [
      {
        type: TRACKING_LOCATION_UPDATED_EVENT,

        handle: handleTrackingLocationUpdated,
      },

      {
        type: TRACKING_STATE_CHANGED_EVENT,

        handle: handleTrackingStateChanged,
      },
    ],

    onError(error, event) {
      /*
       * No imprimimos payloads de ubicación ni
       * información operacional del técnico.
       */
      console.error(
        `[real-time-location/realtime] No fue posible procesar ${event.type}.`,
        error,
      );
    },
  });
