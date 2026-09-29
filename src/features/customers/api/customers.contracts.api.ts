import { z } from "zod";

const positiveIdSchema = z.number().int().positive();
const finiteNumberSchema = z.coerce.number().finite();
const nullableStringSchema = z.string().nullable();
const nullableDateSchema = z.string().min(1).nullable();

export const customerMediaSchema = z.object({
  id: positiveIdSchema,
  categoria: z.string(),
  cdnUrl: z.string(),
  descripcion: z.string(),
  estado: z.string(),
  etiqueta: z.string(),
  titulo: z.string(),
  customerId: positiveIdSchema,
});

export const customerNamedRelationSchema = z.object({
  id: positiveIdSchema,
  nombre: z.string(),
});

export const customerServiceSchema = z.object({
  id: positiveIdSchema,
  nombre: z.string(),
  precio: finiteNumberSchema,
  velocidad: z.string(),
});

export const customerNetworkSchema = z.object({
  id: positiveIdSchema,
  direccion: nullableStringSchema,
  mascara: nullableStringSchema,
  gateway: nullableStringSchema,
});

export const customerLocationSchema = z.object({
  id: positiveIdSchema,
  latitud: finiteNumberSchema,
  longitud: finiteNumberSchema,
});

export const customerBillingZoneSchema = z.object({
  id: positiveIdSchema,
  nombre: z.string(),
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  enviarRecordatorio: z.boolean(),
  diaPago: z.number().int().nullable(),
  diaGeneracionFactura: z.number().int().nullable(),
  diaCorte: z.number().int().nullable(),
});

export const customerContractSchema = z.object({
  id: positiveIdSchema,
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  costoInstalacion: finiteNumberSchema,
  fechaInstalacionProgramada: nullableDateSchema,
  fechaPago: nullableDateSchema,
});

export const customerBalanceSchema = z.object({
  id: positiveIdSchema,
  saldo: finiteNumberSchema,
  saldoPendiente: finiteNumberSchema,
  totalPagos: finiteNumberSchema,
  ultimoPago: nullableDateSchema,
});

export const customerTicketUserSchema = z.object({
  id: z.number().int(),
  nombre: z.string(),
});

export const customerTicketFollowUpUserSchema = z.object({
  id: z.number().int(),
  nombre: z.string(),
  rol: z.string().nullable(),
  perfil: z.object({
    avatar: nullableStringSchema,
    portadaUrl: nullableStringSchema,
    bio: nullableStringSchema,
  }),
});

export const customerTicketFollowUpSchema = z.object({
  id: positiveIdSchema,
  descripcion: z.string(),
  creadoEn: z.string().min(1),
  usuario: customerTicketFollowUpUserSchema,
});

export const customerTicketSummarySchema = z.object({
  id: positiveIdSchema,
  tiempoTecnicoMinutos: z.number().int().nonnegative().nullable(),
  tiempoTotalMinutos: z.number().int().nonnegative().nullable(),
  resueltoComo: nullableStringSchema,
  reabierto: z.boolean(),
  numeroReaperturas: z.number().int().nonnegative(),
  notasInternas: nullableStringSchema,
  creadoEn: z.string().min(1),
});

export const customerTicketSchema = z.object({
  id: positiveIdSchema,
  titulo: nullableStringSchema,
  descripcion: nullableStringSchema,
  estado: z.string(),
  prioridad: z.string(),
  fechaApertura: z.string().min(1),
  fechaCierre: nullableDateSchema,
  fechaInicioAtencion: nullableDateSchema,
  fechaResolucionTecnico: nullableDateSchema,
  resumen: customerTicketSummarySchema.nullable(),
  etiquetas: z.array(
    z.object({
      id: positiveIdSchema,
      nombre: z.string(),
    }),
  ),
  seguimientos: z.array(customerTicketFollowUpSchema),
  creadoPro: customerTicketUserSchema.nullable(),
  tecnico: customerTicketUserSchema.nullable(),
  acompanantes: z.array(customerTicketUserSchema),
});

export const customerInvoicePaymentSchema = z.object({
  fechaPago: z.string().min(1),
  metodoPago: z.string(),
  montoPagado: finiteNumberSchema,
  cobrador: z
    .object({
      id: positiveIdSchema,
      nombreCobrador: z.string(),
      rol: z.string(),
    })
    .nullable(),
});

export const customerInvoiceSchema = z.object({
  id: positiveIdSchema,
  monto: finiteNumberSchema,
  fechaEmision: z.string().min(1),
  fechaPagada: nullableDateSchema,
  fechaVencimiento: nullableDateSchema,
  pagada: z.boolean(),
  estado: z.string(),
  periodo: z.string().nullable(),
  creador: z
    .object({
      id: positiveIdSchema,
      nombre: z.string(),
      rol: z.string(),
    })
    .nullable(),
  pagos: z.array(customerInvoicePaymentSchema),
});

export const customerAdditionalServiceSchema = z.object({
  id: positiveIdSchema,
  servicio: z.object({
    id: positiveIdSchema,
    nombre: z.string(),
    tipo: nullableStringSchema,
    precio: finiteNumberSchema,
  }),
  fechaContratacion: z.string().min(1),
});

export const customerProfileSchema = z.object({
  id: positiveIdSchema,
  nombre: z.string(),
  apellidos: z.string(),
  telefono: nullableStringSchema,
  direccion: nullableStringSchema,
  dpi: nullableStringSchema,
  observaciones: nullableStringSchema,
  contactoReferenciaNombre: nullableStringSchema,
  contactoReferenciaTelefono: nullableStringSchema,
  estadoCliente: z.string(),
  estadoCobranza: z.string(),
  contrasenaWifi: nullableStringSchema,
  ssidRouter: nullableStringSchema,
  fechaInstalacion: nullableDateSchema,
  imagenes: z.array(customerMediaSchema),
  asesor: customerNamedRelationSchema.nullable(),
  servicio: customerServiceSchema.nullable(),
  municipio: customerNamedRelationSchema.nullable(),
  departamento: customerNamedRelationSchema.nullable(),
  sector: customerNamedRelationSchema.nullable(),
  empresa: customerNamedRelationSchema.nullable(),
  IP: customerNetworkSchema.nullable(),
  ubicacion: customerLocationSchema.nullable(),
  facturacionZona: customerBillingZoneSchema.nullable(),
  contratoServicioInternet: customerContractSchema.nullable(),
  saldoCliente: customerBalanceSchema.nullable(),
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  ticketSoporte: z.array(customerTicketSchema),
  facturaInternet: z.array(customerInvoiceSchema),
  clienteServicio: z.array(customerAdditionalServiceSchema),
});

export type CustomerMedia = z.infer<typeof customerMediaSchema>;
export type CustomerNamedRelation = z.infer<typeof customerNamedRelationSchema>;
export type CustomerService = z.infer<typeof customerServiceSchema>;
export type CustomerNetwork = z.infer<typeof customerNetworkSchema>;
export type CustomerLocation = z.infer<typeof customerLocationSchema>;
export type CustomerBillingZone = z.infer<typeof customerBillingZoneSchema>;
export type CustomerContract = z.infer<typeof customerContractSchema>;
export type CustomerBalance = z.infer<typeof customerBalanceSchema>;
export type CustomerTicketFollowUp = z.infer<
  typeof customerTicketFollowUpSchema
>;
export type CustomerTicket = z.infer<typeof customerTicketSchema>;
export type CustomerInvoice = z.infer<typeof customerInvoiceSchema>;
export type CustomerInvoicePayment = z.infer<
  typeof customerInvoicePaymentSchema
>;
export type CustomerAdditionalService = z.infer<
  typeof customerAdditionalServiceSchema
>;
export type CustomerProfile = z.infer<typeof customerProfileSchema>;
