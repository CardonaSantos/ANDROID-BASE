import { AppError, isAppError } from "@/core/errors";

import {
  createTicketConformity,
  getCurrentTicketConformity,
} from "../api/ticket-conformity.api";

import type { TicketConformityDetail } from "../api/ticket-conformity.contracts.api";

/*
 * =========================================================
 * PORT
 * =========================================================
 *
 * La dependencia inyectable hace esta orquestación testeable sin
 * acoplarla a React Query.
 * =========================================================
 */

export interface PrepareTicketConformityPort {
  getCurrent(ticketId: number): Promise<TicketConformityDetail>;
  create(ticketId: number): Promise<unknown>;
}

const defaultPort: PrepareTicketConformityPort = {
  getCurrent: (ticketId) => getCurrentTicketConformity(ticketId),
  create: (ticketId) => createTicketConformity(ticketId),
};

export function isHttpStatus(error: unknown, status: number): boolean {
  return isAppError(error) && error.status === status;
}

function assertTicketId(ticketId: number) {
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "TICKET_CONFORMITY_INVALID_TICKET_ID",
      message: "El identificador del ticket no es válido.",
    });
  }
}

async function createOrJoinCurrentCycle(
  ticketId: number,
  port: PrepareTicketConformityPort,
): Promise<TicketConformityDetail> {
  try {
    await port.create(ticketId);
  } catch (error) {
    /*
     * 409 es una carrera válida: otro request creó el ciclo
     * entre nuestro GET y POST. Se resuelve leyendo el actual.
     */
    if (!isHttpStatus(error, 409)) {
      throw error;
    }
  }

  return port.getCurrent(ticketId);
}

/**
 * Garantiza que exista un ciclo utilizable para firma.
 *
 * - 404 -> crea ciclo.
 * - REQUIERE_RETRABAJO -> crea nuevo ciclo.
 * - 409 al crear -> recupera el ciclo que ganó la carrera.
 * - PENDIENTE / CONFORME -> reutiliza el ciclo actual.
 *
 * La firma técnica puede agregarse incluso después de que el cliente
 * marque CONFORME, tal como permite el backend actual.
 */
export async function prepareTicketConformity(
  ticketId: number,
  port: PrepareTicketConformityPort = defaultPort,
): Promise<TicketConformityDetail> {
  assertTicketId(ticketId);

  let current: TicketConformityDetail;

  try {
    current = await port.getCurrent(ticketId);
  } catch (error) {
    if (!isHttpStatus(error, 404)) {
      throw error;
    }

    return createOrJoinCurrentCycle(ticketId, port);
  }

  if (
    current.resultado === "REQUIERE_RETRABAJO" ||
    current.resumen.requiereRetrabajo
  ) {
    return createOrJoinCurrentCycle(ticketId, port);
  }

  return current;
}
