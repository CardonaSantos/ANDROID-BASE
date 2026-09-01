import {
  createRealtimeFeatureBinding,
  type RealtimeFeatureBinding,
} from "@/core/realtime/realtime-handlers";

import {
  handleTrackingLocationUpdated,
  TRACKING_LOCATION_UPDATED_EVENT,
} from "./real-time-location.realtime-handler";

/*
 * =========================================================
 * REALTIME BINDING
 * =========================================================
 *
 * Este archivo traduce:
 *
 * evento Socket.IO
 *       ↓
 * handler del feature
 *
 * El Core no conoce real-time-location y este feature
 * tampoco necesita conocer Socket.IO directamente.
 * =========================================================
 */

export const realTimeLocationRealtimeBinding: RealtimeFeatureBinding =
  createRealtimeFeatureBinding({
    handlers: [
      {
        type: TRACKING_LOCATION_UPDATED_EVENT,

        handle: handleTrackingLocationUpdated,
      },
    ],

    onError(error, event) {
      /*
       * No imprimimos el payload porque puede contener
       * datos operativos del técnico.
       *
       * Más adelante esto puede dirigirse a telemetry.
       */
      console.error(
        `[real-time-location/realtime] No fue posible procesar ${event.type}.`,
        error,
      );
    },
  });
