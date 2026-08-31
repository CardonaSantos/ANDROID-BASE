import { z } from "zod";

/*
 * =========================================================
 * ENUMS / VALUE OBJECTS
 * =========================================================
 */

export const ticketStatusSchema = z.enum([
  "ABIERTA",
  "EN_PROCESO",
  "PENDIENTE",
  "PENDIENTE_CLIENTE",
  "PENDIENTE_TECNICO",
  "NUEVO",
  "PENDIENTE_REVISION",
  "RESUELTA",
  "ARCHIVADA",
  "CERRADO",
  "CANCELADA",
]);

export const ticketPrioritySchema = z.enum([
  "BAJA",
  "MEDIA",
  "ALTA",
  "URGENTE",
]);

export const ticketLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

/*
 * =========================================================
 * MEDIA
 * =========================================================
 */

export const ticketMediaSchema = z.object({
  id: z.number().int().positive(),

  titulo: z.string().nullable(),

  descripcion: z.string().nullable(),

  notas: z.string().nullable(),

  creadoEn: z.string().min(1),

  actualizadoEn: z.string().min(1),

  cdnUrl: z.string().url(),
});

/*
 * =========================================================
 * CAMPOS COMPARTIDOS
 * =========================================================
 */

const ticketAssignedBaseSchema = z.object({
  id: z.number().int().positive(),

  titulo: z.string().nullable(),

  abiertoEn: z.string().min(1),

  estado: ticketStatusSchema,

  prioridad: ticketPrioritySchema,

  descripcion: z.string().nullable(),

  clienteNombre: z.string(),

  clienteTel: z.string().nullable(),

  referenciaContacto: z.string().nullable(),

  ubicacionMaps: ticketLocationSchema.nullable(),

  medias: z.array(ticketMediaSchema),
});

/*
 * =========================================================
 * LISTADO
 *
 * GET dashboard/get-tickets-asignados/:tecId
 *
 * Importante:
 * El listado devuelve direccion como string | null.
 * No devuelve observaciones.
 * =========================================================
 */

export const ticketAssignedListItemSchema = ticketAssignedBaseSchema.extend({
  clientId: z.number().int().positive().nullable(),

  direccion: z.string().nullable(),
});

export const ticketsAssignedListResponseSchema = z.array(
  ticketAssignedListItemSchema,
);

/*
 * =========================================================
 * DETALLE
 *
 * GET dashboard/get-ticket-asignado-details/:ticketId
 *
 * El detalle devuelve una direccion enriquecida y agrega
 * observaciones.
 * =========================================================
 */

export const ticketDetailAddressSchema = z.object({
  direccion: z.string(),

  sector: z.string(),

  municipio: z.string(),
});

export const ticketAssignedDetailSchema = ticketAssignedBaseSchema.extend({
  clientId: z.number().int().positive(),

  direccion: ticketDetailAddressSchema,

  observaciones: z.string(),
});

/*
 * =========================================================
 * MUTACIONES DE CICLO
 *
 * PATCH tickets-soporte/update-ticket-proceso/:ticketId
 * PATCH tickets-soporte/update-ticket-revision/:ticketId
 * =========================================================
 */

export const ticketStatusMutationResponseSchema = z.object({
  id: z.number().int().positive(),

  estado: ticketStatusSchema,
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export type TicketPriority = z.infer<typeof ticketPrioritySchema>;

export type TicketLocation = z.infer<typeof ticketLocationSchema>;

export type TicketMedia = z.infer<typeof ticketMediaSchema>;

export type TicketAssignedListItem = z.infer<
  typeof ticketAssignedListItemSchema
>;

export type TicketsAssignedListResponse = z.infer<
  typeof ticketsAssignedListResponseSchema
>;

export type TicketDetailAddress = z.infer<typeof ticketDetailAddressSchema>;

export type TicketAssignedDetail = z.infer<typeof ticketAssignedDetailSchema>;

export type TicketStatusMutationResponse = z.infer<
  typeof ticketStatusMutationResponseSchema
>;
