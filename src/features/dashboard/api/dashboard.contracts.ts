import { z } from "zod";

const nonNegativeIntegerSchema = z.number().int().nonnegative();

const nonNegativeNumberSchema = z.number().nonnegative();

export const technicianPanelUserSchema = z.object({
  id: z.number().int().positive(),

  nombre: z.string().min(1),

  correo: z.string(),

  rol: z.string().min(1),

  activo: z.boolean(),
});

export const technicianPanelPeriodSchema = z.object({
  inicioMes: z.string().min(1),

  finMes: z.string().min(1),

  diasTranscurridos: nonNegativeIntegerSchema,

  zonaHoraria: z.string().min(1),
});

export const technicianPanelWorkloadSchema = z.object({
  ticketsPendientes: nonNegativeIntegerSchema,

  ticketsListosParaTrabajar: nonNegativeIntegerSchema,

  ticketsUrgentes: nonNegativeIntegerSchema,

  ticketsConMas48Horas: nonNegativeIntegerSchema,

  instalacionesPendientes: nonNegativeIntegerSchema,

  instalacionesProgramadasHoy: nonNegativeIntegerSchema,

  instalacionesAtrasadas: nonNegativeIntegerSchema,
});

export const technicianPanelProductivitySchema = z.object({
  ticketsResueltos: nonNegativeIntegerSchema,

  instalacionesCompletadas: nonNegativeIntegerSchema,

  trabajosCompletados: nonNegativeIntegerSchema,

  diasConActividad: nonNegativeIntegerSchema,

  promedioTicketsPorDia: nonNegativeNumberSchema,

  ritmoSemanalTickets: nonNegativeNumberSchema,

  promedioTrabajosPorDiaActivo: nonNegativeNumberSchema,
});

export const technicianPanelTimesSchema = z.object({
  promedioResolucionTicketMinutos: nonNegativeNumberSchema.nullable(),

  promedioInstalacionMinutos: nonNegativeNumberSchema.nullable(),
});

export const technicianPanelActivityDaySchema = z.object({
  fecha: z.string().min(1),

  etiqueta: z.string().min(1),

  tickets: nonNegativeIntegerSchema,

  instalaciones: nonNegativeIntegerSchema,

  total: nonNegativeIntegerSchema,
});

export const technicianPanelActivitySummarySchema = z.object({
  diaMasProductivo: technicianPanelActivityDaySchema.nullable(),

  diaMenosProductivoConActividad: technicianPanelActivityDaySchema.nullable(),
});

export const technicianPanelResponseSchema = z.object({
  tecnico: technicianPanelUserSchema,

  periodo: technicianPanelPeriodSchema,

  cargaActual: technicianPanelWorkloadSchema,

  productividadMes: technicianPanelProductivitySchema,

  tiempos: technicianPanelTimesSchema,

  resumenActividad: technicianPanelActivitySummarySchema,

  actividadDiaria: z.array(technicianPanelActivityDaySchema),
});

export type TechnicianPanelUser = z.infer<typeof technicianPanelUserSchema>;

export type TechnicianPanelPeriod = z.infer<typeof technicianPanelPeriodSchema>;

export type TechnicianPanelWorkload = z.infer<
  typeof technicianPanelWorkloadSchema
>;

export type TechnicianPanelProductivity = z.infer<
  typeof technicianPanelProductivitySchema
>;

export type TechnicianPanelTimes = z.infer<typeof technicianPanelTimesSchema>;

export type TechnicianPanelActivityDay = z.infer<
  typeof technicianPanelActivityDaySchema
>;

export type TechnicianPanelActivitySummary = z.infer<
  typeof technicianPanelActivitySummarySchema
>;

export type TechnicianPanelResponse = z.infer<
  typeof technicianPanelResponseSchema
>;
