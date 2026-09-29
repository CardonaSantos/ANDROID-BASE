import { z } from "zod";

/*
 * =========================================================
 * SHARED
 * =========================================================
 */

const nullableTrimmedStringSchema = z
  .string()
  .transform((value) => value.trim())
  .nullable();

const moneySchema = z.coerce.number().finite();

/*
 * =========================================================
 * ASSIGNED ROUTES
 * GET ruta-cobro/rutas-cobros-asignadas?id=:collectorId
 * =========================================================
 */

export const assignedRouteCollectorSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  rol: z.string().nullable().optional(),
});

export const assignedRouteListItemSchema = z.object({
  id: z.number().int().positive(),
  nombreRuta: z.string(),
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  observaciones: nullableTrimmedStringSchema,
  cobrador: assignedRouteCollectorSchema.nullable().optional(),
  _count: z.object({
    clientes: z.number().int().nonnegative(),
  }),
});

export const assignedRoutesResponseSchema = z.object({
  rutas: z.array(assignedRouteListItemSchema),
  totales: z.object({
    totalRutas: z.number().int().nonnegative(),
    totalClientes: z.number().int().nonnegative(),
  }),
});

/*
 * =========================================================
 * ROUTE DETAIL
 * GET ruta-cobro/get-one-ruta-cobro/:rutaId
 * =========================================================
 *
 * El backend histórico devuelve `ubicacion: []` cuando un cliente no tiene
 * coordenadas. Normalizamos ese detalle en el borde de API para que toda la
 * aplicación trabaje con `CollectionClientLocation | null`.
 */

export const collectionClientLocationSchema = z.preprocess(
  (value) => {
    if (Array.isArray(value) && value.length === 0) {
      return null;
    }

    return value;
  },
  z
    .object({
      latitud: z.coerce.number().finite(),
      longitud: z.coerce.number().finite(),
    })
    .nullable(),
);

export const collectionInvoiceSchema = z.object({
  id: z.number().int().positive(),
  montoPago: moneySchema,
  estadoFactura: z.string().min(1),
  saldoPendiente: moneySchema,
  creadoEn: z.string().min(1),
  detalleFactura: z.string().nullable(),
});

export const collectionClientSchema = z.object({
  id: z.number().int().positive(),
  nombreCompleto: z.string(),
  telefono: z.string().nullable(),
  direccion: z.string().nullable(),
  imagenes: z.array(z.string()),
  contactoReferencia: z.object({
    telefono: z.string().nullable(),
    nombre: z.string().nullable(),
  }),
  ubicacion: collectionClientLocationSchema,
  facturas: z.array(collectionInvoiceSchema),
  saldo: z.object({
    saldoFavor: moneySchema,
    saldoPendiente: moneySchema,
    ultimoPago: z.string().nullable(),
  }),
  totalDebe: moneySchema,
});

export const collectionRouteDetailSchema = z.object({
  id: z.number().int().positive(),
  nombreRuta: z.string(),
  creadoEn: z.string().min(1),
  actualizadoEn: z.string().min(1),
  cobrador: z
    .object({
      id: z.number().int().positive(),
      nombre: z.string(),
      correo: z.string().nullable(),
    })
    .nullable(),
  clientes: z.array(collectionClientSchema),
});

/*
 * =========================================================
 * PAYMENT
 * POST facturacion/create-new-payment-for-ruta
 * =========================================================
 */

export const collectionPaymentMethodSchema = z.enum([
  "EFECTIVO",
  "DEPOSITO",
  "TARJETA",
  "PAYPAL",
  "OTRO",
]);

export const createCollectionPaymentInputSchema = z
  .object({
    facturaInternetId: z.number().int().positive(),
    clienteId: z.number().int().positive(),
    montoPagado: z.number().finite().positive("El monto debe ser mayor a cero."),
    metodoPago: collectionPaymentMethodSchema,
    cobradorId: z.number().int().positive(),
    numeroBoleta: z.string(),
    rutaId: z.number().int().positive(),
    observaciones: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.metodoPago === "DEPOSITO" && !value.numeroBoleta.trim()) {
      context.addIssue({
        code: "custom",
        path: ["numeroBoleta"],
        message: "Ingresa el número de boleta para un depósito.",
      });
    }
  });

/*
 * =========================================================
 * INVOICE RECEIPT / THERMAL PRINT DATA
 * GET facturacion/factura-to-pdf/:invoiceId
 * =========================================================
 *
 * Este contrato replica el DTO real usado por CrmPdfPago en producción.
 * La impresión Android reutiliza la misma fuente de verdad y NO depende
 * de los datos resumidos que trae la ruta de cobro.
 */

export const collectionReceiptPaymentSchema = z.object({
  id: z.number().int().positive(),
  metodoPago: z.string().min(1),
  montoPagado: moneySchema,
  fechaPago: z.string().min(1),
  creadoEn: z.string().min(1),
  numeroBoleta: z.string().nullable().optional(),
});

export const collectionReceiptServiceSchema = z.object({
  facturaId: z.number().int().positive(),
  nombre: z.string(),
  monto: moneySchema,
  pagado: moneySchema,
  fecha: z.string().min(1),
  estado: z.string().min(1),
});

export const collectionInvoiceReceiptSchema = z.object({
  id: z.number().int().positive(),
  estadoFacturaInternet: z.string().min(1),
  montoPago: moneySchema,
  detalleFactura: z.string().nullable(),
  creadoEn: z.string().min(1),
  fechaPagoEsperada: z.string().nullable().optional(),
  saldoPendiente: moneySchema,
  periodo: z.string().min(1),

  cliente: z.object({
    id: z.number().int().positive(),
    nombre: z.string(),
    apellidos: z.string().nullable(),
    dpi: z.string().nullable(),
  }),

  empresa: z.object({
    id: z.number().int().positive(),
    nombre: z.string(),
    direccion: z.string().nullable(),
    correo: z.string().nullable(),
    pbx: z.string().nullable(),
    sitioWeb: z.string().nullable(),
    telefono: z.string().nullable(),
    nit: z.string().nullable(),
  }),

  pagos: z.array(collectionReceiptPaymentSchema),
  servicios: z.array(collectionReceiptServiceSchema),
});

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type AssignedRouteCollector = z.infer<
  typeof assignedRouteCollectorSchema
>;

export type AssignedRouteListItem = z.infer<
  typeof assignedRouteListItemSchema
>;

export type AssignedRoutesResponse = z.infer<
  typeof assignedRoutesResponseSchema
>;

export type CollectionClientLocation = z.infer<
  typeof collectionClientLocationSchema
>;

export type CollectionInvoice = z.infer<typeof collectionInvoiceSchema>;

export type CollectionClient = z.infer<typeof collectionClientSchema>;

export type CollectionRouteDetail = z.infer<
  typeof collectionRouteDetailSchema
>;

export type CollectionPaymentMethod = z.infer<
  typeof collectionPaymentMethodSchema
>;

export type CreateCollectionPaymentInput = z.infer<
  typeof createCollectionPaymentInputSchema
>;

export type CollectionReceiptPayment = z.infer<
  typeof collectionReceiptPaymentSchema
>;

export type CollectionReceiptService = z.infer<
  typeof collectionReceiptServiceSchema
>;

export type CollectionInvoiceReceipt = z.infer<
  typeof collectionInvoiceReceiptSchema
>;
