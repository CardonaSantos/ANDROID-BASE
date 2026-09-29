import type { ZodType } from "zod";

import { AppError } from "@/core/errors";
import { httpClient } from "@/core/http";

import {
  createTicketCommentInputSchema,
  ticketAssignedDetailSchema,
  ticketCommentCreateResponseSchema,
  ticketsAssignedListResponseSchema,
  ticketStatusMutationResponseSchema,
  type CreateTicketCommentInput,
  type TicketAssignedDetail,
  type TicketCommentCreateResponse,
  type TicketsAssignedListResponse,
  type TicketStatusMutationResponse,
} from "./tickets.contracts.api";

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

export async function createTicketComment(
  input: CreateTicketCommentInput,
  signal?: AbortSignal,
): Promise<TicketCommentCreateResponse> {
  const parsedInput = createTicketCommentInputSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "TICKET_COMMENT_INVALID_INPUT",
      message: "El comentario no es válido.",
      details: parsedInput.error.issues,
    });
  }

  const payload = await httpClient.request<unknown, CreateTicketCommentInput>({
    method: "POST",
    path: "ticket-seguimiento",
    auth: "auto",
    body: parsedInput.data,
    signal,
  });

  return parseTicketsResponse(
    ticketCommentCreateResponseSchema,
    payload,
    "TICKET_COMMENT_INVALID_RESPONSE",
  );
}

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
