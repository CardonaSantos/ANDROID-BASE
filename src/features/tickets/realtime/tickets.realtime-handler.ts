import { queryClient } from "@/core/query";
import type { RealtimeEvent } from "@/core/realtime";

import { ticketsQueryKeys } from "../application/tickets.query";
import {
  TicketAssignmentChangedPayload,
  ticketAssignmentChangedPayloadSchema,
} from "./tickets.realtime.contracts";

/*
 * =========================================================
 * TICKET ASSIGNMENT REALTIME HANDLER
 * =========================================================
 *
 * Fuente de verdad:
 *
 * Socket.IO NO transporta el ticket completo.
 *
 * El evento únicamente informa que la relación entre
 * el usuario conectado y un ticket cambió.
 *
 * Después del evento sincronizamos TanStack Query con
 * los endpoints HTTP autoritativos.
 * =========================================================
 */

/**
 * Sincroniza las queries relacionadas con una nueva
 * asignación.
 *
 * El listado de tickets asignados utiliza keys bajo:
 *
 * tickets -> assigned
 *
 * Invalidar el prefijo assigned cubre cualquier query:
 *
 * assignedByTechnician(userId)
 *
 * que se encuentre activa en la aplicación.
 */
async function handleAssigned(
  payload: TicketAssignmentChangedPayload,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.assigned(),
    }),

    /*
     * Si este ticket ya había sido consultado anteriormente,
     * forzamos también su refresco.
     *
     * Si todavía no existe en cache, invalidateQueries
     * simplemente no tiene trabajo que realizar.
     */
    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.detail(payload.ticketId),
      exact: true,
    }),
  ]);
}

/**
 * Sincroniza las queries cuando el usuario deja de estar
 * asignado al ticket.
 *
 * Aquí existe una diferencia importante respecto ASSIGNED:
 *
 * no queremos conservar un detalle potencialmente sensible
 * o desactualizado en cache después de perder la asignación.
 */
async function handleUnassigned(
  payload: TicketAssignmentChangedPayload,
): Promise<void> {
  /*
   * Primero detenemos cualquier request del detalle que
   * pudiera encontrarse en progreso.
   *
   * Ejemplo:
   *
   * 1. usuario abre ticket 150;
   * 2. GET detalle sigue pendiente;
   * 3. admin lo desasigna;
   * 4. llega UNASSIGNED;
   * 5. cancelamos antes de eliminar cache.
   *
   * Así evitamos que una respuesta HTTP antigua vuelva a
   * poblar el detalle inmediatamente después del evento.
   */
  await queryClient.cancelQueries({
    queryKey: ticketsQueryKeys.detail(payload.ticketId),
    exact: true,
  });

  /*
   * Eliminamos el detalle del cache.
   *
   * Si el usuario vuelve a acceder posteriormente, tendrá
   * que obtener nuevamente el estado autorizado del Server.
   */
  queryClient.removeQueries({
    queryKey: ticketsQueryKeys.detail(payload.ticketId),
    exact: true,
  });

  /*
   * El listado sí debe volver a consultarse para que el
   * ticket desaparezca inmediatamente de "Mis tickets".
   */
  await queryClient.invalidateQueries({
    queryKey: ticketsQueryKeys.assigned(),
  });
}

/*
 * =========================================================
 * PUBLIC HANDLER
 * =========================================================
 */

export async function handleTicketAssignmentChanged(
  event: RealtimeEvent,
): Promise<void> {
  /*
   * Ningún payload Socket.IO entra al feature sin validar.
   *
   * Si el Server rompe accidentalmente el contrato,
   * Zod lanza y createRealtimeFeatureBinding enviará el
   * error al onError del feature.
   */
  const incoming = ticketAssignmentChangedPayloadSchema.parse(event.payload);

  if (incoming.change === "ASSIGNED") {
    await handleAssigned(incoming);

    return;
  }

  await handleUnassigned(incoming);
}
