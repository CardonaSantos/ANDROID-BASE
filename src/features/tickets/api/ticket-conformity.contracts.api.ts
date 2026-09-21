import { z } from "zod";

/*
 * =========================================================
 * ENUMS
 * =========================================================
 */

export const ticketConformityResultSchema = z.enum([
  "PENDIENTE",
  "CONFORME",
  "REQUIERE_RETRABAJO",
]);

export const ticketConformityChannelSchema = z.enum([
  "LINK",
  "QR",
  "WHATSAPP",
]);

export const ticketSignatureTypeSchema = z.enum(["CLIENTE", "TECNICO"]);

export const ticketSignatureOriginSchema = z.enum(["CRM", "PUBLICO"]);

/*
 * =========================================================
 * SHARED
 * =========================================================
 */

const ticketConformityTicketSchema = z.object({
  id: z.number().int().positive(),
  clienteId: z.number().int().positive().nullable(),
  empresaId: z.number().int().positive().nullable(),
  tecnicoId: z.number().int().positive().nullable(),
  creadoPorId: z.number().int().positive().nullable(),
  estado: z.string(),
  prioridad: z.string(),
  titulo: z.string().nullable(),
  descripcion: z.string().nullable(),
  fechaApertura: z.string(),
  fechaAsignacion: z.string().nullable(),
  fechaInicioAtencion: z.string().nullable(),
  fechaResolucionTecnico: z.string().nullable(),
  fechaCierre: z.string().nullable(),
});

const ticketConformityClientSchema = z.object({
  id: z.number().int().positive(),
  empresaId: z.number().int().positive().nullable(),
  nombre: z.string(),
  apellidos: z.string().nullable(),
  nombreCompleto: z.string(),
  telefono: z.string().nullable(),
  direccion: z.string().nullable(),
});

const ticketConformityUserSchema = z.object({
  id: z.number().int().positive(),
  empresaId: z.number().int().positive(),
  nombre: z.string(),
  correo: z.string(),
  telefono: z.string().nullable(),
  rol: z.string(),
  activo: z.boolean(),
});

const ticketConformitySignatureMediaSchema = z.object({
  id: z.number().int().positive(),
  empresaId: z.number().int().positive(),
  clienteId: z.number().int().positive().nullable(),
  categoria: z.string(),
  tipo: z.string(),
  estado: z.string(),
  bucket: z.string().nullable(),
  key: z.string(),
  cdnUrl: z.string().nullable(),
  mimeType: z.string().nullable(),
  extension: z.string().nullable(),
  tamanioBytes: z.union([z.string(), z.number()]).nullable(),
  titulo: z.string().nullable(),
  descripcion: z.string().nullable(),
  publico: z.boolean(),
  creadoEn: z.string(),
});

const ticketConformitySignatureSchema = z.object({
  id: z.number().int().positive(),
  conformidadId: z.number().int().positive(),
  mediaId: z.number().int().positive(),
  tipo: ticketSignatureTypeSchema,
  usuarioFirmanteId: z.number().int().positive().nullable(),
  nombreFirmante: z.string(),
  telefonoFirmante: z.string().nullable(),
  origen: ticketSignatureOriginSchema,
  ipOrigen: z.string().nullable(),
  userAgent: z.string().nullable(),
  firmadoEn: z.string(),
  usuarioFirmante: ticketConformityUserSchema.nullable(),
  media: ticketConformitySignatureMediaSchema,
});

const ticketConformityLinkSchema = z.object({
  id: z.number().int().positive(),
  conformidadId: z.number().int().positive(),
  canal: ticketConformityChannelSchema,
  telefonoDestino: z.string().nullable(),
  expiraEn: z.string(),
  usadoEn: z.string().nullable(),
  revocadoEn: z.string().nullable(),
  creadoPorId: z.number().int().positive().nullable(),
  creadoEn: z.string(),
  estadoDerivado: z.string(),
});

const ticketConformitySummarySchema = z.object({
  tieneFirmaCliente: z.boolean(),
  tieneFirmaTecnico: z.boolean(),
  firmaClienteEn: z.string().nullable(),
  firmaTecnicoEn: z.string().nullable(),
  cantidadFirmas: z.number().int().nonnegative(),
  cantidadEnlaces: z.number().int().nonnegative(),
  cantidadEnlacesUsados: z.number().int().nonnegative(),
  cantidadEnlacesExpirados: z.number().int().nonnegative(),
  cantidadEnlacesRevocados: z.number().int().nonnegative(),
  cantidadEnlacesActivos: z.number().int().nonnegative(),
  ultimoEnlaceCanal: ticketConformityChannelSchema.nullable(),
  ultimoEnlaceCreadoEn: z.string().nullable(),
  requiereRetrabajo: z.boolean(),
  estaConforme: z.boolean(),
  estaPendiente: z.boolean(),
  tiempoRespuestaMinutos: z.number().nullable(),
});

/*
 * =========================================================
 * CURRENT / DETAIL
 * =========================================================
 */

export const ticketConformityDetailSchema = z.object({
  id: z.number().int().positive(),
  ticketId: z.number().int().positive(),
  clienteId: z.number().int().positive().nullable(),
  tecnicoAsignadoId: z.number().int().positive().nullable(),
  creadoPorId: z.number().int().positive().nullable(),
  resultado: ticketConformityResultSchema,
  creadoEn: z.string(),
  actualizadoEn: z.string(),
  respondidoEn: z.string().nullable(),
  ticket: ticketConformityTicketSchema,
  cliente: ticketConformityClientSchema.nullable(),
  tecnicoAsignado: ticketConformityUserSchema.nullable(),
  creadoPor: ticketConformityUserSchema.nullable(),
  firmas: z.array(ticketConformitySignatureSchema),
  enlaces: z.array(ticketConformityLinkSchema),
  resumen: ticketConformitySummarySchema,
});

/*
 * =========================================================
 * CREATE
 * =========================================================
 */

export const createTicketConformityResponseSchema = z.object({
  props: z.object({
    id: z.number().int().positive(),
    ticketId: z.number().int().positive(),
    clienteId: z.number().int().positive().nullable(),
    tecnicoAsignadoId: z.number().int().positive().nullable(),
    creadoPorId: z.number().int().positive().nullable(),
    resultado: ticketConformityResultSchema,
    creadoEn: z.string(),
    actualizadoEn: z.string(),
    respondidoEn: z.string().nullable(),
  }),
});

/*
 * =========================================================
 * LINK
 * =========================================================
 */

export const generateTicketConformityLinkResponseSchema = z.object({
  enlaceId: z.number().int().positive(),
  conformidadId: z.number().int().positive(),
  token: z.string().min(1),
  canal: ticketConformityChannelSchema,
  telefonoDestino: z.string().nullable(),
  expiraEn: z.string(),
  creadoEn: z.string(),
});

/*
 * =========================================================
 * SIGNATURE RESPONSES
 * =========================================================
 */

export const registerTechnicianSignatureResponseSchema = z.object({
  conformidadId: z.number().int().positive(),
  firmaId: z.number().int().positive(),
  mediaId: z.number().int().positive(),
  usuarioFirmanteId: z.number().int().positive(),
  nombreFirmante: z.string(),
  firmadoEn: z.string(),
});

export const registerClientSignatureResponseSchema = z.object({
  conformidadId: z.number().int().positive(),
  resultado: ticketConformityResultSchema,
  firmaId: z.number().int().positive(),
  mediaId: z.number().int().positive(),
  nombreFirmante: z.string(),
  telefonoFirmante: z.string().nullable(),
  firmadoEn: z.string(),
  respondidoEn: z.string(),
  enlaceId: z.number().int().positive(),
  usadoEn: z.string(),
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TicketConformityResult = z.infer<typeof ticketConformityResultSchema>;
export type TicketConformityChannel = z.infer<typeof ticketConformityChannelSchema>;
export type TicketConformityDetail = z.infer<typeof ticketConformityDetailSchema>;
export type CreateTicketConformityResponse = z.infer<typeof createTicketConformityResponseSchema>;
export type GenerateTicketConformityLinkResponse = z.infer<typeof generateTicketConformityLinkResponseSchema>;
export type RegisterTechnicianSignatureResponse = z.infer<typeof registerTechnicianSignatureResponseSchema>;
export type RegisterClientSignatureResponse = z.infer<typeof registerClientSignatureResponseSchema>;
