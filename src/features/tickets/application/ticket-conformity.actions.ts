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
 */

export interface PrepareTicketConformityPort {
  getCurrent(ticketId: number): Promise<TicketConformityDetail | null>;

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

/*
 * =========================================================
 * CREATE / JOIN
 * =========================================================
 */

async function createOrJoinCurrentCycle(
  ticketId: number,
  port: PrepareTicketConformityPort,
): Promise<TicketConformityDetail> {
  try {
    await port.create(ticketId);
  } catch (error) {
    /*
     * 409 es una carrera válida:
     * otro request creó el ciclo entre nuestro GET y POST.
     */
    if (!isHttpStatus(error, 409)) {
      throw error;
    }
  }

  /*
   * El POST de creación no devuelve el detalle enriquecido,
   * por eso volvemos a consultar el ciclo actual.
   */
  const current = await port.getCurrent(ticketId);

  if (current === null) {
    throw new AppError({
      kind: "server",
      source: "application",
      code: "TICKET_CONFORMITY_NOT_AVAILABLE_AFTER_CREATE",
      message:
        "La conformidad fue preparada, pero el servidor no devolvió el ciclo actual.",
    });
  }

  return current;
}

/**
 * Garantiza que exista un ciclo utilizable para firma.
 *
 * - 200 + null -> crea ciclo.
 * - 404 -> crea ciclo por compatibilidad.
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

  let current: TicketConformityDetail | null;

  try {
    current = await port.getCurrent(ticketId);
  } catch (error) {
    /*
     * Conservamos soporte para 404 por si backend
     * vuelve a utilizar NotFoundException.
     */
    if (!isHttpStatus(error, 404)) {
      throw error;
    }

    return createOrJoinCurrentCycle(ticketId, port);
  }

  /*
   * Contrato actual del backend:
   * GET /actual devuelve 200 + null si todavía
   * no existe conformidad.
   */
  if (current === null) {
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
