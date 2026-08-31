import { queryOptions } from "@tanstack/react-query";

import {
  getAssignedTicketDetail,
  getAssignedTickets,
} from "../api/tickets.api";

/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 *
 * Estructura jerárquica:
 *
 * tickets
 * ├── assigned
 * │   └── technician/:technicianId
 * └── detail/:ticketId
 *
 * Esto nos permitirá posteriormente invalidar:
 *
 * - todos los tickets;
 * - solamente los asignados;
 * - los asignados de un técnico;
 * - un detalle específico.
 */

export const ticketsQueryKeys = {
  all: ["tickets"] as const,

  assigned: () => [...ticketsQueryKeys.all, "assigned"] as const,

  assignedByTechnician: (technicianId: number) =>
    [...ticketsQueryKeys.assigned(), "technician", technicianId] as const,

  details: () => [...ticketsQueryKeys.all, "detail"] as const,

  detail: (ticketId: number) =>
    [...ticketsQueryKeys.details(), ticketId] as const,
};

/*
 * =========================================================
 * TICKETS ASIGNADOS
 * =========================================================
 */

export function assignedTicketsQueryOptions(technicianId: number) {
  return queryOptions({
    queryKey: ticketsQueryKeys.assignedByTechnician(technicianId),

    queryFn: ({ signal }) => getAssignedTickets(technicianId, signal),

    /*
     * Evitamos cualquier request con ids
     * todavía no disponibles.
     */
    enabled: Number.isInteger(technicianId) && technicianId > 0,

    /*
     * Los tickets son información operativa.
     *
     * No queremos mantener durante varios minutos
     * un listado potencialmente desactualizado,
     * pero tampoco golpear el servidor en cada render.
     */
    staleTime: 30_000,

    /*
     * Al volver a montar la pantalla recuperamos
     * el estado actual de asignaciones.
     */
    refetchOnMount: "always",

    refetchOnReconnect: "always",

    retry: 1,
  });
}

/*
 * =========================================================
 * DETALLE DE TICKET
 * =========================================================
 */

export function assignedTicketDetailQueryOptions(ticketId: number) {
  return queryOptions({
    queryKey: ticketsQueryKeys.detail(ticketId),

    queryFn: ({ signal }) => getAssignedTicketDetail(ticketId, signal),

    enabled: Number.isInteger(ticketId) && ticketId > 0,

    /*
     * También es información operativa.
     *
     * Después de Tomar en proceso / Enviar a revisión
     * invalidaremos explícitamente este detalle.
     */
    staleTime: 30_000,

    refetchOnMount: "always",

    refetchOnReconnect: "always",

    retry: 1,
  });
}
