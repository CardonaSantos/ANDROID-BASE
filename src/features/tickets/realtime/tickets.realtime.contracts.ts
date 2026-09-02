import {
  ticketPrioritySchema,
  ticketStatusSchema,
} from "@/features/tickets/api/tickets.contracts.api";
import { z } from "zod";

/*
 * =========================================================
 * TICKET ASSIGNMENT REALTIME CONTRACT
 * =========================================================
 *
 * Contrato de entrada para:
 *
 * ticket:assignment-changed
 *
 * El servidor NO envía el ticket completo.
 *
 * El evento únicamente informa:
 *
 * - qué ticket cambió;
 * - si este usuario fue agregado o removido;
 * - por qué ocurrió;
 * - información mínima para reaccionar inmediatamente.
 *
 * El estado autoritativo sigue obteniéndose mediante HTTP.
 * =========================================================
 */

export const TICKET_ASSIGNMENT_CHANGED_EVENT =
  "ticket:assignment-changed" as const;

/*
 * =========================================================
 * CHANGE
 * =========================================================
 */

export const ticketAssignmentChangeSchema = z.enum(["ASSIGNED", "UNASSIGNED"]);

/*
 * =========================================================
 * REASON
 * =========================================================
 */

export const ticketAssignmentReasonSchema = z.enum(["CREATED", "REASSIGNED"]);

/*
 * =========================================================
 * PAYLOAD
 * =========================================================
 */

export const ticketAssignmentChangedPayloadSchema = z.object({
  /*
   * Nos permite evolucionar el contrato posteriormente
   * sin interpretar accidentalmente payloads incompatibles.
   */
  version: z.literal(1),

  ticketId: z.number().int().positive(),

  empresaId: z.number().int().positive(),

  change: ticketAssignmentChangeSchema,

  reason: ticketAssignmentReasonSchema,

  title: z.string().min(1),

  status: ticketStatusSchema,

  priority: ticketPrioritySchema,

  /*
   * El Server utiliza:
   *
   * new Date().toISOString()
   *
   * por lo que esperamos una fecha ISO con timezone.
   */
  occurredAt: z.string().datetime({
    offset: true,
  }),
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TicketAssignmentChange = z.infer<
  typeof ticketAssignmentChangeSchema
>;

export type TicketAssignmentReason = z.infer<
  typeof ticketAssignmentReasonSchema
>;

export type TicketAssignmentChangedPayload = z.infer<
  typeof ticketAssignmentChangedPayloadSchema
>;
