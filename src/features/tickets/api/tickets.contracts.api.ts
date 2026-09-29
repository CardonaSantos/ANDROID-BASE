import { z } from "zod";

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

export const ticketHistoryTypeSchema = z.enum([
  "CREADO",
  "ACTUALIZADO",
  "ESTADO_CAMBIADO",
  "PRIORIDAD_CAMBIADA",
  "ASIGNACION_CAMBIADA",
  "CANCELADO",
  "REABIERTO",
  "FIJADO",
  "DESFIJADO",
]);

export const ticketLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ticketUserSummarySchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1),
  rol: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
});

export const ticketMediaSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().nullable(),
  descripcion: z.string().nullable(),
  notas: z.string().nullable(),
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  cdnUrl: z.string().url(),
});

export const ticketCommentSchema = z.object({
  id: z.number().int().positive(),
  descripcion: z.string(),
  fechaRegistro: z.string().min(1),
  actualizadoEn: z.string().min(1),
  usuario: ticketUserSummarySchema,
});

export const createTicketCommentInputSchema = z.object({
  ticketId: z.number().int().positive(),
  descripcion: z.string().trim().min(1).max(2000),
});

export const ticketCommentCreateResponseSchema = ticketCommentSchema.extend({
  ticketId: z.number().int().positive(),
});

export const ticketHistoryActorSchema = z.object({
  usuarioId: z.number().int().positive().nullable(),
  nombre: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
});

export const ticketHistoryItemSchema = z.object({
  id: z.number().int().positive(),
  tipo: ticketHistoryTypeSchema,
  descripcion: z.string().nullable(),
  creadoEn: z.string().min(1),
  actor: ticketHistoryActorSchema,
});

export const ticketTagSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1),
});

export const ticketOperationalDatesSchema = z.object({
  abiertoEn: z.string().min(1),
  asignadoEn: z.string().min(1).nullable(),
  iniciadoEn: z.string().min(1).nullable(),
  resueltoTecnicoEn: z.string().min(1).nullable(),
  cerradoEn: z.string().min(1).nullable(),
  actualizadoEn: z.string().min(1).nullable(),
});

export const ticketResolutionSolutionSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1),
  descripcion: z.string().nullable(),
});

export const ticketResolutionSummarySchema = z.object({
  id: z.number().int().positive(),
  resueltoComo: z.string().nullable(),
  notasInternas: z.string().nullable(),
  tiempoTotalMinutos: z.number().int().nonnegative().nullable(),
  tiempoTecnicoMinutos: z.number().int().nonnegative().nullable(),
  reabierto: z.boolean(),
  numeroReaperturas: z.number().int().nonnegative(),
  intentos: z.number().int().nonnegative(),
  solucion: ticketResolutionSolutionSchema.nullable(),
});

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

export const ticketAssignedListItemSchema = ticketAssignedBaseSchema.extend({
  clientId: z.number().int().positive().nullable(),
  direccion: z.string().nullable(),
});

export const ticketsAssignedListResponseSchema = z.array(
  ticketAssignedListItemSchema,
);

export const ticketDetailAddressSchema = z.object({
  direccion: z.string(),
  sector: z.string(),
  municipio: z.string(),
  departamento: z.string(),
});

export const ticketAssignedDetailSchema = ticketAssignedBaseSchema.extend({
  clientId: z.number().int().positive().nullable(),
  direccion: ticketDetailAddressSchema,
  observaciones: z.string(),
  fijado: z.boolean(),
  creador: ticketUserSummarySchema.nullable(),
  tecnico: ticketUserSummarySchema.nullable(),
  tecnicosAdicionales: z.array(ticketUserSummarySchema),
  etiquetas: z.array(ticketTagSchema),
  fechas: ticketOperationalDatesSchema,
  comentarios: z.array(ticketCommentSchema),
  historial: z.array(ticketHistoryItemSchema),
  resumen: ticketResolutionSummarySchema.nullable(),
});

export const ticketStatusMutationResponseSchema = z.object({
  id: z.number().int().positive(),
  estado: ticketStatusSchema,
});

export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type TicketPriority = z.infer<typeof ticketPrioritySchema>;
export type TicketHistoryType = z.infer<typeof ticketHistoryTypeSchema>;
export type TicketLocation = z.infer<typeof ticketLocationSchema>;
export type TicketUserSummary = z.infer<typeof ticketUserSummarySchema>;
export type TicketMedia = z.infer<typeof ticketMediaSchema>;
export type TicketComment = z.infer<typeof ticketCommentSchema>;
export type CreateTicketCommentInput = z.infer<
  typeof createTicketCommentInputSchema
>;
export type TicketCommentCreateResponse = z.infer<
  typeof ticketCommentCreateResponseSchema
>;
export type TicketHistoryActor = z.infer<typeof ticketHistoryActorSchema>;
export type TicketHistoryItem = z.infer<typeof ticketHistoryItemSchema>;
export type TicketTag = z.infer<typeof ticketTagSchema>;
export type TicketOperationalDates = z.infer<
  typeof ticketOperationalDatesSchema
>;
export type TicketResolutionSummary = z.infer<
  typeof ticketResolutionSummarySchema
>;
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
