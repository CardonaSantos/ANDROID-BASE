import { z } from "zod";

export const trackingStatusSchema = z.enum([
  "ACTIVA",
  "FINALIZADA",
  "EXPIRADA",
]);

export const trackingInactiveStateSchema = z.object({
  activo: z.literal(false),

  sesionTrackingId: z.null(),

  asistenciaId: z.null(),

  estado: z.null(),

  iniciadoEn: z.null(),

  ultimoHeartbeatEn: z.null(),
});

export const trackingActiveStateSchema = z.object({
  activo: z.literal(true),

  sesionTrackingId: z.number().int().positive(),

  asistenciaId: z.number().int().positive(),

  estado: trackingStatusSchema,

  iniciadoEn: z.string().min(1),

  ultimoHeartbeatEn: z.string().min(1),
});

export const trackingStateSchema = z.discriminatedUnion("activo", [
  trackingInactiveStateSchema,
  trackingActiveStateSchema,
]);

export const startTrackingResponseSchema = z.object({
  sesionTrackingId: z.number().int().positive(),

  asistenciaId: z.number().int().positive(),

  estado: trackingStatusSchema,

  iniciadoEn: z.string().min(1),

  ultimoHeartbeatEn: z.string().min(1),
});

export type TrackingStatus = z.infer<typeof trackingStatusSchema>;

export type TrackingState = z.infer<typeof trackingStateSchema>;

export type TrackingActiveState = z.infer<typeof trackingActiveStateSchema>;

export type StartTrackingResponse = z.infer<typeof startTrackingResponseSchema>;
