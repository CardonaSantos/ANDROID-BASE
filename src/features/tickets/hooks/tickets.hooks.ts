import { useQuery } from "@tanstack/react-query";

import {
  assignedTicketDetailQueryOptions,
  assignedTicketsQueryOptions,
} from "../application/tickets.query";

/*
 * =========================================================
 * LISTADO DE TICKETS ASIGNADOS
 * =========================================================
 */

export function useAssignedTicketsQuery(technicianId: number) {
  return useQuery(assignedTicketsQueryOptions(technicianId));
}

/*
 * =========================================================
 * DETALLE DE TICKET
 * =========================================================
 */

export function useAssignedTicketDetailQuery(ticketId: number) {
  return useQuery(assignedTicketDetailQueryOptions(ticketId));
}
