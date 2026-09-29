import { z } from "zod";

import {
  collectionPaymentMethodSchema,
  createCollectionPaymentInputSchema,
  type CollectionInvoice,
  type CollectionPaymentMethod,
  type CreateCollectionPaymentInput,
} from "../api/collections.contracts.api";

const collectionPaymentFormSchema = z.object({
  montoPagado: z.string(),
  metodoPago: collectionPaymentMethodSchema,
  numeroBoleta: z.string(),
  observaciones: z.string(),
});

export type CollectionPaymentFormState = z.infer<
  typeof collectionPaymentFormSchema
>;

export const COLLECTION_PAYMENT_METHOD_OPTIONS: readonly {
  value: CollectionPaymentMethod;
  label: string;
}[] = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "DEPOSITO", label: "Depósito" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "OTRO", label: "Otro" },
];

export function createCollectionPaymentForm(
  invoice: CollectionInvoice,
): CollectionPaymentFormState {
  return {
    montoPagado: String(invoice.saldoPendiente),
    metodoPago: "EFECTIVO",
    numeroBoleta: "",
    observaciones: "",
  };
}

export type BuildCollectionPaymentResult =
  | {
      success: true;
      data: CreateCollectionPaymentInput;
    }
  | {
      success: false;
      message: string;
    };

export function buildCollectionPaymentInput(params: {
  form: CollectionPaymentFormState;
  invoiceId: number;
  clientId: number;
  collectorId: number;
  routeId: number;
}): BuildCollectionPaymentResult {
  const normalizedAmount = params.form.montoPagado.trim().replace(",", ".");
  const amount = Number(normalizedAmount);

  const result = createCollectionPaymentInputSchema.safeParse({
    facturaInternetId: params.invoiceId,
    clienteId: params.clientId,
    montoPagado: amount,
    metodoPago: params.form.metodoPago,
    cobradorId: params.collectorId,
    numeroBoleta: params.form.numeroBoleta.trim(),
    rutaId: params.routeId,
    observaciones: params.form.observaciones.trim() || undefined,
  });

  if (!result.success) {
    return {
      success: false,
      message:
        result.error.issues[0]?.message ?? "Revisa los datos antes de continuar.",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
