import { z } from "zod";

/*
 * =========================================================
 * ENUMS / VALUE OBJECTS
 * =========================================================
 */

export const installationStatusSchema = z.enum([
  "PROGRAMADA",
  "EN_PROCESO",
  "COMPLETADA",
  "CANCELADA",
  "FALLIDA",
  "REPROGRAMADA",
]);

export const installationTypeSchema = z.enum([
  "NUEVA",
  "REINSTALACION",
  "TRASLADO",
  "CAMBIO_EQUIPO",
  "MIGRACION_PLAN",
  "MIGRACION_TECNOLOGIA",
  "OTRO",
]);

export const installationTechnicianRoleSchema = z.enum([
  "RESPONSABLE",
  "APOYO",
  "SUPERVISOR",
  "COBRADOR",
  "OTRO",
]);

export const installationEvidenceTypeSchema = z.enum([
  "ANTES",
  "DESPUES",
  "EQUIPO",
  "ROUTER",
  "ONU",
  "ANTENA",
  "CABLEADO",
  "UBICACION",
  "FIRMA",
  "BOLETA",
  "RECIBO",
  "DOCUMENTO",
  "OTRO",
]);

/*
 * =========================================================
 * NORMALIZACIÓN DE IMPORTES
 * =========================================================
 *
 * El listado técnico entrega importes como number.
 *
 * Algunos importes del detalle técnico pueden provenir
 * directamente del value object Money del backend.
 *
 * Dentro de la aplicación SIEMPRE trabajaremos con number.
 * La normalización queda encerrada en la frontera API.
 * =========================================================
 */

export const installationMoneySchema = z.preprocess((value) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (!normalized) {
      return value;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : value;
  }

  if (value && typeof value === "object" && "amount" in value) {
    const amount = (value as { amount?: unknown }).amount;

    if (typeof amount === "number") {
      return amount;
    }

    if (typeof amount === "string") {
      const parsed = Number(amount.trim());

      return Number.isFinite(parsed) ? parsed : value;
    }
  }

  return value;
}, z.number().finite().nonnegative());

/*
 * =========================================================
 * CAMPOS COMPARTIDOS
 * =========================================================
 */

export const installationLocationSchema = z.object({
  direccion: z.string().nullable(),

  referencia: z.string().nullable(),

  latitud: z.number().nullable(),

  longitud: z.number().nullable(),
});

export const installationInternetServiceSchema = z.object({
  id: z.number().int().positive(),

  nombre: z.string(),

  velocidad: z.string().nullable(),

  precio: installationMoneySchema.nullable(),
});

export const installationMyAssignmentSchema = z.object({
  asignacionId: z.number().int().positive(),

  tecnicoId: z.number().int().positive().nullable(),

  rol: installationTechnicianRoleSchema,

  esResponsable: z.boolean(),
});

export const installationResponsibleTechnicianSchema = z.object({
  asignacionId: z.number().int().positive(),

  tecnicoId: z.number().int().positive().nullable(),

  nombre: z.string(),

  avatarUrl: z.string().nullable(),
});

export const installationCountsSchema = z.object({
  tecnicos: z.number().int().nonnegative(),

  evidencias: z.number().int().nonnegative(),

  equipos: z.number().int().nonnegative(),
});

export const installationPaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),

  page: z.number().int().positive(),

  limit: z.number().int().positive(),

  totalPages: z.number().int().nonnegative(),
});

/*
 * =========================================================
 * LISTADO DE MIS INSTALACIONES ASIGNADAS
 *
 * GET cliente-instalaciones/mis-asignadas
 *
 * El técnico NO se recibe como parámetro.
 * El servidor obtiene su identidad desde el JWT.
 * =========================================================
 */

export const assignedInstallationAgendaSchema = z.object({
  creadoEn: z.string().min(1),

  programadaPara: z.string().nullable(),

  inicioReal: z.string().nullable(),

  finalizacionReal: z.string().nullable(),
});

export const assignedInstallationClientSchema = z.object({
  id: z.number().int().positive(),

  nombreCompleto: z.string(),

  telefono: z.string().nullable(),

  direccion: z.string().nullable(),
});

export const assignedInstallationBillingSchema = z.object({
  costoInstalacion: installationMoneySchema,

  montoCobradoCliente: installationMoneySchema,

  pendienteCobrar: installationMoneySchema,
});

export const assignedInstallationListItemSchema = z.object({
  id: z.number().int().positive(),

  empresaId: z.number().int().positive(),

  tipo: installationTypeSchema,

  estado: installationStatusSchema,

  agenda: assignedInstallationAgendaSchema,

  cliente: assignedInstallationClientSchema,

  ubicacion: installationLocationSchema,

  servicioInternet: installationInternetServiceSchema.nullable(),

  cobro: assignedInstallationBillingSchema,

  miAsignacion: installationMyAssignmentSchema,

  tecnicoResponsable: installationResponsibleTechnicianSchema.nullable(),

  conteos: installationCountsSchema,
});

export const assignedInstallationsResponseSchema = z.object({
  data: z.array(assignedInstallationListItemSchema),

  meta: installationPaginationMetaSchema,
});

/*
 * Parámetros que realmente acepta /mis-asignadas.
 *
 * tecnicoId NO pertenece aquí.
 */
export interface AssignedInstallationsParams {
  page?: number;

  limit?: number;

  search?: string;

  estado?: InstallationStatus;

  fechaProgramadaDesde?: string;

  fechaProgramadaHasta?: string;
}

/*
 * =========================================================
 * DETALLE TÉCNICO
 *
 * GET cliente-instalaciones/:id/tecnica
 * =========================================================
 */

export const installationTechnicalAgendaSchema = z.object({
  creadoEn: z.string().min(1),

  actualizadoEn: z.string().min(1),

  programadaPara: z.string().nullable(),

  inicioReal: z.string().nullable(),

  finalizacionReal: z.string().nullable(),

  canceladaEn: z.string().nullable(),

  servicioActivadoEn: z.string().nullable(),
});

export const installationTechnicalWorkSchema = z.object({
  descripcion: z.string().nullable(),

  motivo: z.string().nullable(),

  observaciones: z.string().nullable(),

  resultado: z.string().nullable(),
});

export const installationTechnicalClientSchema = z.object({
  id: z.number().int().positive(),

  nombreCompleto: z.string(),

  telefono: z.string().nullable(),

  telefonoReferencia: z.string().nullable(),

  dpi: z.string().nullable(),

  direccion: z.string().nullable(),

  observaciones: z.string().nullable(),

  municipio: z.string().nullable(),

  departamento: z.string().nullable(),

  sector: z.string().nullable(),
});

export const installationTechnicalBillingSchema = z.object({
  costoInstalacion: installationMoneySchema,

  costoMateriales: installationMoneySchema,

  costoManoObra: installationMoneySchema,

  costoOtros: installationMoneySchema,

  montoCobradoCliente: installationMoneySchema,

  pendienteCobrar: installationMoneySchema,

  notas: z.string().nullable(),
});

/*
 * =========================================================
 * PARTICIPANTES
 * =========================================================
 */

export const installationTechnicalParticipantSchema = z.object({
  asignacionId: z.number().int().positive(),

  tecnicoId: z.number().int().positive().nullable(),

  nombre: z.string(),

  avatarUrl: z.string().nullable(),

  rol: installationTechnicianRoleSchema,

  esResponsable: z.boolean(),

  tiempoMinutos: z.number().int().nonnegative().nullable(),

  observaciones: z.string().nullable(),
});

/*
 * =========================================================
 * ACCESO / CONFIGURACIÓN DE RED
 * =========================================================
 */

export const installationTechnicalNetworkSchema = z.object({
  ipv4: z.string().nullable(),

  ipv6: z.string().nullable(),

  gateway: z.string().nullable(),

  dnsPrimario: z.string().nullable(),

  dnsSecundario: z.string().nullable(),
});

export const installationTechnicalConfigurationSchema = z.object({
  id: z.number().int().positive(),

  potenciaOpticaRxDbm: z.number().nullable(),

  senalInalambricaDbm: z.number().nullable(),

  ssid: z.string().nullable(),

  tieneContrasenaWifi: z.boolean(),

  bandaWifi: z.string().nullable(),

  canal: z.number().nullable(),

  anchoCanalMhz: z.number().nullable(),

  red: installationTechnicalNetworkSchema,

  observaciones: z.string().nullable(),
});

export const installationTechnicalPppoeAccountSchema = z.object({
  id: z.number().int().positive(),

  usuario: z.string(),

  estado: z.string().min(1),

  perfilHomologacionId: z.number().int().positive(),

  codigoPerfil: z.string(),

  mikrotikRouterId: z.number().int().positive(),

  routerNombre: z.string(),

  generadoEn: z.string().min(1),

  activadoEn: z.string().nullable(),

  ultimaSincronizacionEn: z.string().nullable(),

  ultimoError: z.string().nullable(),
});

export const installationTechnicalAccessSchema = z.object({
  vinculoId: z.number().int().positive(),

  accion: z.string().min(1),

  /*
   * El presenter HTTP lo expone como "id".
   * Internamente corresponde al accesoInternetId.
   */
  id: z.number().int().positive(),

  tecnologia: z.string().min(1),

  metodoAutenticacion: z.string().min(1),

  estado: z.string().min(1),

  servicioInternetId: z.number().int().positive().nullable(),

  configuracionTecnica: installationTechnicalConfigurationSchema.nullable(),

  cuentaPppoe: installationTechnicalPppoeAccountSchema.nullable(),
});

/*
 * =========================================================
 * EVIDENCIAS
 * =========================================================
 */

export const installationTechnicalEvidenceSchema = z.object({
  id: z.number().int().positive(),

  mediaId: z.number().int().positive(),

  tipo: installationEvidenceTypeSchema,

  descripcion: z.string().nullable(),

  orden: z.number().int().nonnegative(),

  url: z.string().nullable(),

  mimeType: z.string().nullable(),

  titulo: z.string().nullable(),

  creadoEn: z.string().min(1),
});

/*
 * =========================================================
 * EQUIPOS
 * =========================================================
 */

export const installationTechnicalEquipmentSchema = z.object({
  id: z.number().int().positive(),

  productoId: z.number().int().positive().nullable(),

  productoNombre: z.string().nullable(),

  serialProductoId: z.number().int().positive().nullable(),

  serial: z.string().nullable(),

  descripcion: z.string().nullable(),

  cantidad: z.number().int().positive(),

  esPrincipal: z.boolean(),

  notas: z.string().nullable(),
});

/*
 * =========================================================
 * ACCIONES AUTORIZADAS POR EL SERVIDOR
 * =========================================================
 *
 * Estas propiedades son la fuente de verdad para decidir
 * qué acciones operativas puede presentar Android.
 * =========================================================
 */

export const installationTechnicalActionSchema = z.object({
  habilitada: z.boolean(),

  motivo: z.string().nullable(),
});

export const installationTechnicalActionsSchema = z.object({
  reprogramar: installationTechnicalActionSchema,

  iniciar: installationTechnicalActionSchema,

  completar: installationTechnicalActionSchema,

  cancelar: installationTechnicalActionSchema,

  subirEvidencia: installationTechnicalActionSchema,

  revelarCredenciales: installationTechnicalActionSchema,

  reintentarPrealta: installationTechnicalActionSchema,
});

/*
 * =========================================================
 * DETALLE TÉCNICO COMPLETO
 * =========================================================
 */

export const installationTechnicalDetailSchema = z.object({
  id: z.number().int().positive(),

  empresaId: z.number().int().positive(),

  tipo: installationTypeSchema,

  estado: installationStatusSchema,

  agenda: installationTechnicalAgendaSchema,

  trabajo: installationTechnicalWorkSchema,

  cliente: installationTechnicalClientSchema,

  ubicacion: installationLocationSchema,

  servicioInternet: installationInternetServiceSchema.nullable(),

  cobro: installationTechnicalBillingSchema,

  miAsignacion: installationMyAssignmentSchema.nullable(),

  participantes: z.array(installationTechnicalParticipantSchema),

  accesos: z.array(installationTechnicalAccessSchema),

  evidencias: z.array(installationTechnicalEvidenceSchema),

  equipos: z.array(installationTechnicalEquipmentSchema),

  acciones: installationTechnicalActionsSchema,
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type InstallationStatus = z.infer<typeof installationStatusSchema>;

export type InstallationType = z.infer<typeof installationTypeSchema>;

export type InstallationTechnicianRole = z.infer<
  typeof installationTechnicianRoleSchema
>;

export type InstallationEvidenceType = z.infer<
  typeof installationEvidenceTypeSchema
>;

export type InstallationLocation = z.infer<typeof installationLocationSchema>;

export type InstallationInternetService = z.infer<
  typeof installationInternetServiceSchema
>;

export type InstallationMyAssignment = z.infer<
  typeof installationMyAssignmentSchema
>;

export type InstallationResponsibleTechnician = z.infer<
  typeof installationResponsibleTechnicianSchema
>;

export type InstallationCounts = z.infer<typeof installationCountsSchema>;

export type InstallationPaginationMeta = z.infer<
  typeof installationPaginationMetaSchema
>;

export type AssignedInstallationAgenda = z.infer<
  typeof assignedInstallationAgendaSchema
>;

export type AssignedInstallationClient = z.infer<
  typeof assignedInstallationClientSchema
>;

export type AssignedInstallationBilling = z.infer<
  typeof assignedInstallationBillingSchema
>;

export type AssignedInstallationListItem = z.infer<
  typeof assignedInstallationListItemSchema
>;

export type AssignedInstallationsResponse = z.infer<
  typeof assignedInstallationsResponseSchema
>;

export type InstallationTechnicalAgenda = z.infer<
  typeof installationTechnicalAgendaSchema
>;

export type InstallationTechnicalWork = z.infer<
  typeof installationTechnicalWorkSchema
>;

export type InstallationTechnicalClient = z.infer<
  typeof installationTechnicalClientSchema
>;

export type InstallationTechnicalBilling = z.infer<
  typeof installationTechnicalBillingSchema
>;

export type InstallationTechnicalParticipant = z.infer<
  typeof installationTechnicalParticipantSchema
>;

export type InstallationTechnicalNetwork = z.infer<
  typeof installationTechnicalNetworkSchema
>;

export type InstallationTechnicalConfiguration = z.infer<
  typeof installationTechnicalConfigurationSchema
>;

export type InstallationTechnicalPppoeAccount = z.infer<
  typeof installationTechnicalPppoeAccountSchema
>;

export type InstallationTechnicalAccess = z.infer<
  typeof installationTechnicalAccessSchema
>;

export type InstallationTechnicalEvidence = z.infer<
  typeof installationTechnicalEvidenceSchema
>;

export type InstallationTechnicalEquipment = z.infer<
  typeof installationTechnicalEquipmentSchema
>;

export type InstallationTechnicalAction = z.infer<
  typeof installationTechnicalActionSchema
>;

export type InstallationTechnicalActions = z.infer<
  typeof installationTechnicalActionsSchema
>;

export type InstallationTechnicalDetail = z.infer<
  typeof installationTechnicalDetailSchema
>;
