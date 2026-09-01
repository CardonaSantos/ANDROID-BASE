import { z } from "zod";

/*
 * =========================================================
 * TRACKING STATUS
 * =========================================================
 *
 * Debe permanecer alineado con:
 *
 * EstadoTrackingTecnico
 *
 * del servidor.
 * =========================================================
 */

export const technicianTrackingStatusSchema = z.enum([
  "ACTIVA",
  "FINALIZADA",
  "EXPIRADA",
]);

/*
 * =========================================================
 * DATE / TIME
 * =========================================================
 *
 * El servidor trabaja internamente con Date,
 * pero JSON / Socket.IO los transporta como strings ISO.
 *
 * No modelamos Date en el borde de red.
 * =========================================================
 */

const isoDateTimeSchema = z.string().datetime({
  offset: true,
});

/*
 * =========================================================
 * TECHNICIAN
 * =========================================================
 */

export const realtimeTechnicianSchema = z.object({
  id: z.number().int().positive(),

  nombre: z.string().min(1),

  telefono: z.string().nullable(),

  rol: z.string().min(1),

  avatarUrl: z.string().url().nullable(),
});

/*
 * =========================================================
 * TRACKING SESSION
 * =========================================================
 */

export const realtimeTrackingSessionSchema = z.object({
  sesionId: z.number().int().positive(),

  asistenciaId: z.number().int().positive(),

  estado: technicianTrackingStatusSchema,

  iniciadoEn: isoDateTimeSchema,

  ultimoHeartbeatEn: isoDateTimeSchema,
});

/*
 * =========================================================
 * LOCATION
 * =========================================================
 */

export const realtimeTechnicianLocationSchema = z.object({
  latitud: z.number().finite().min(-90).max(90),

  longitud: z.number().finite().min(-180).max(180),

  precision: z.number().finite().nullable(),

  velocidad: z.number().finite().nullable(),

  bateria: z.number().finite().nullable(),

  capturadoEn: isoDateTimeSchema.nullable(),

  recibidoEn: isoDateTimeSchema,
});

/*
 * =========================================================
 * OPERATIONAL ACTIVITY
 * =========================================================
 */

export const realtimeTicketInProgressSchema = z.object({
  id: z.number().int().positive(),

  titulo: z.string().nullable(),

  estado: z.string().min(1),

  prioridad: z.string().min(1),
});

export const realtimeTechnicianActivitySchema = z.object({
  ticketsEnProceso: z.array(realtimeTicketInProgressSchema),
});

/*
 * =========================================================
 * REALTIME VIEW
 * =========================================================
 *
 * Contrato compartido conceptualmente por:
 *
 * Socket:
 * tracking:location-updated
 *
 * Futuro HTTP:
 * GET /real-time-location/tracking/realtime
 *
 * El servidor ya construye esta forma mediante
 * TecnicoTrackingRealtimeView.
 * =========================================================
 */

export const technicianTrackingRealtimeViewSchema = z.object({
  tecnico: realtimeTechnicianSchema,

  tracking: realtimeTrackingSessionSchema,

  ubicacion: realtimeTechnicianLocationSchema.nullable(),

  actividad: realtimeTechnicianActivitySchema,
});

/*
 * =========================================================
 * FUTURE HTTP SNAPSHOT
 * =========================================================
 *
 * Todavía no existe el endpoint.
 *
 * Dejamos el contrato listo para que el GET inicial del
 * mapa y los eventos Socket.IO utilicen exactamente la
 * misma representación.
 * =========================================================
 */

export const technicianTrackingRealtimeListSchema = z.array(
  technicianTrackingRealtimeViewSchema,
);

// NUEVOS
/*
 * =========================================================
 * TRACKING STATE CHANGED
 * =========================================================
 *
 * Evento Socket.IO:
 *
 * tracking:state-changed
 *
 * No contiene una vista enriquecida del técnico.
 * Su responsabilidad es comunicar cambios en el ciclo
 * de vida de una sesión de tracking.
 * =========================================================
 */

export const technicianTrackingStateChangedSchema = z.object({
  tecnicoId: z.number().int().positive(),

  sesionTrackingId: z.number().int().positive(),

  asistenciaId: z.number().int().positive(),

  estado: technicianTrackingStatusSchema,

  iniciadoEn: isoDateTimeSchema,

  finalizadoEn: isoDateTimeSchema.nullable(),

  ultimoHeartbeatEn: isoDateTimeSchema,
});

// NUEVOS

/*
 * =========================================================
 * TRACKING DEVICE SESSION
 * =========================================================
 *
 * Contratos usados por el propio dispositivo técnico.
 *
 * POST /real-time-location/tracking/start
 * POST /real-time-location/tracking/location
 * =========================================================
 */
/*
 * =========================================================
 * DEVICE TRACKING SESSION
 * =========================================================
 */

export const technicianTrackingSessionStartedSchema = z.object({
  sesionTrackingId: z.number().int().positive(),

  asistenciaId: z.number().int().positive(),

  estado: technicianTrackingStatusSchema,

  iniciadoEn: isoDateTimeSchema,

  ultimoHeartbeatEn: isoDateTimeSchema,
});

/*
 * =========================================================
 * REGISTER DEVICE LOCATION
 * =========================================================
 */

export const registerTechnicianLocationRequestSchema = z.object({
  sesionTrackingId: z.number().int().positive(),

  latitud: z.number().finite().min(-90).max(90),

  longitud: z.number().finite().min(-180).max(180),

  precision: z.number().finite().min(0).nullable().optional(),

  velocidad: z.number().finite().min(0).nullable().optional(),

  bateria: z.number().int().min(0).max(100).nullable().optional(),

  capturadoEn: isoDateTimeSchema,
});

export const registerTechnicianLocationResponseSchema = z.object({
  ubicacionId: z.number().int().positive(),

  sesionTrackingId: z.number().int().positive(),

  estado: technicianTrackingStatusSchema,

  capturadoEn: isoDateTimeSchema,

  recibidoEn: isoDateTimeSchema,

  ultimoHeartbeatEn: isoDateTimeSchema,
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TechnicianTrackingStatus = z.infer<
  typeof technicianTrackingStatusSchema
>;

export type RealtimeTechnician = z.infer<typeof realtimeTechnicianSchema>;

export type RealtimeTrackingSession = z.infer<
  typeof realtimeTrackingSessionSchema
>;

export type RealtimeTechnicianLocation = z.infer<
  typeof realtimeTechnicianLocationSchema
>;

export type RealtimeTicketInProgress = z.infer<
  typeof realtimeTicketInProgressSchema
>;

export type RealtimeTechnicianActivity = z.infer<
  typeof realtimeTechnicianActivitySchema
>;

export type TechnicianTrackingRealtimeView = z.infer<
  typeof technicianTrackingRealtimeViewSchema
>;

export type TechnicianTrackingRealtimeList = z.infer<
  typeof technicianTrackingRealtimeListSchema
>;

export type TechnicianTrackingSessionStarted = z.infer<
  typeof technicianTrackingSessionStartedSchema
>;

export type RegisterTechnicianLocationRequest = z.infer<
  typeof registerTechnicianLocationRequestSchema
>;

export type RegisterTechnicianLocationResponse = z.infer<
  typeof registerTechnicianLocationResponseSchema
>;

export type TechnicianTrackingStateChanged = z.infer<
  typeof technicianTrackingStateChangedSchema
>;
