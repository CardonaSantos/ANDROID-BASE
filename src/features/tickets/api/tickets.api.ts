import type { ZodType } from "zod";

import { AppError } from "@/core/errors";
import { httpClient } from "@/core/http";

import {
  ticketAssignedDetailSchema,
  ticketsAssignedListResponseSchema,
  ticketStatusMutationResponseSchema,
  type TicketAssignedDetail,
  type TicketsAssignedListResponse,
  type TicketStatusMutationResponse,
} from "./tickets.contracts.api";

/*
 * =========================================================
 * RESPONSE PARSER
 * =========================================================
 *
 * Ninguna respuesta externa entra al feature sin validarse.
 *
 * Si el servidor cambia accidentalmente su contrato,
 * convertimos ese problema en un AppError estructurado
 * en vez de propagar datos inválidos hacia la UI.
 */

function parseTicketsResponse<T>(
  schema: ZodType<T>,
  payload: unknown,
  code: string,
): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",
      source: "application",
      code,
      message: "El servidor devolvió una respuesta de tickets inválida.",
      details: result.error.issues,
    });
  }

  return result.data;
}

/*
 * =========================================================
 * LISTADO DE TICKETS ASIGNADOS
 * =========================================================
 *
 * CRM:
 * useGetTicketsAsignados(tecId)
 *
 * GET dashboard/get-tickets-asignados/:tecId
 */

export async function getAssignedTickets(
  technicianId: number,
  signal?: AbortSignal,
): Promise<TicketsAssignedListResponse> {
  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `dashboard/get-tickets-asignados/${technicianId}`,
    auth: "auto",
    signal,
  });

  return parseTicketsResponse(
    ticketsAssignedListResponseSchema,
    payload,
    "ASSIGNED_TICKETS_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * DETALLE DE TICKET
 * =========================================================
 *
 * CRM:
 * useGetTicketDetails(ticketId)
 *
 * GET dashboard/get-ticket-asignado-details/:ticketId
 */

export async function getAssignedTicketDetail(
  ticketId: number,
  signal?: AbortSignal,
): Promise<TicketAssignedDetail> {
  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `dashboard/get-ticket-asignado-details/${ticketId}`,
    auth: "auto",
    signal,
  });

  return parseTicketsResponse(
    ticketAssignedDetailSchema,
    payload,
    "ASSIGNED_TICKET_DETAIL_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * TOMAR TICKET EN PROCESO
 * =========================================================
 *
 * CRM:
 * usePatchTicketEnProceso(ticketId)
 *
 * PATCH tickets-soporte/update-ticket-proceso/:ticketId
 *
 * Este endpoint no recibe body.
 */

export async function startAssignedTicket(
  ticketId: number,
  signal?: AbortSignal,
): Promise<TicketStatusMutationResponse> {
  const payload = await httpClient.request<unknown>({
    method: "PATCH",
    path: `tickets-soporte/update-ticket-proceso/${ticketId}`,
    auth: "auto",
    signal,
  });

  return parseTicketsResponse(
    ticketStatusMutationResponseSchema,
    payload,
    "START_ASSIGNED_TICKET_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * ENVIAR TICKET A REVISIÓN
 * =========================================================
 *
 * CRM:
 * usePatchTicketEnRevision(ticketId)
 *
 * PATCH tickets-soporte/update-ticket-revision/:ticketId
 *
 * Este endpoint tampoco recibe body.
 */

export async function sendAssignedTicketToReview(
  ticketId: number,
  signal?: AbortSignal,
): Promise<TicketStatusMutationResponse> {
  const payload = await httpClient.request<unknown>({
    method: "PATCH",
    path: `tickets-soporte/update-ticket-revision/${ticketId}`,
    auth: "auto",
    signal,
  });

  return parseTicketsResponse(
    ticketStatusMutationResponseSchema,
    payload,
    "REVIEW_ASSIGNED_TICKET_INVALID_RESPONSE",
  );
}
