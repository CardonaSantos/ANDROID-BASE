import {
  createRealtimeFeatureBinding,
  type RealtimeFeatureBinding,
} from "@/core/realtime/realtime-handlers";

import { TICKET_ASSIGNMENT_CHANGED_EVENT } from "./tickets.realtime.contracts";

import { handleTicketAssignmentChanged } from "./tickets.realtime-handler";

/*
 * =========================================================
 * TICKETS REALTIME BINDING
 * =========================================================
 *
 * Responsabilidad:
 *
 * conectar los eventos Socket.IO del dominio Tickets
 * con los handlers propios del feature.
 *
 * Core continúa siendo responsable exclusivamente de:
 *
 * - transporte Socket.IO;
 * - autenticación;
 * - conexión/reconexión;
 * - distribución de eventos.
 *
 * Tickets decide:
 *
 * - qué eventos escucha;
 * - cómo valida el payload;
 * - qué cache debe sincronizar.
 * =========================================================
 */

export const ticketsRealtimeBinding: RealtimeFeatureBinding =
  createRealtimeFeatureBinding({
    handlers: [
      {
        type: TICKET_ASSIGNMENT_CHANGED_EVENT,

        handle: handleTicketAssignmentChanged,
      },
    ],

    onError(error, event) {
      /*
       * No imprimimos el payload completo.
       *
       * El payload puede contener información operacional
       * del ticket que no necesitamos exponer en consola.
       */
      console.error(
        `[tickets/realtime] No fue posible procesar ${event.type}.`,
        error,
      );
    },
  });
