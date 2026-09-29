import type { ZodType } from "zod";

import { AppError } from "@/core/errors";
import { httpClient } from "@/core/http";

import {
  assignedRoutesResponseSchema,
  collectionInvoiceReceiptSchema,
  collectionRouteDetailSchema,
  type AssignedRoutesResponse,
  type CollectionInvoiceReceipt,
  type CollectionRouteDetail,
  type CreateCollectionPaymentInput,
} from "./collections.contracts.api";

function parseCollectionsResponse<T>(
  schema: ZodType<T>,
  payload: unknown,
  code: string,
): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",
      source: "application",
      code,
      message: "El servidor devolvió una respuesta de cobros inválida.",
      details: result.error.issues,
    });
  }

  return result.data;
}

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "COLLECTIONS_INVALID_ID",
      message: `El identificador ${field} no es válido.`,
    });
  }
}

export async function getAssignedCollectionRoutes(
  collectorId: number,
  signal?: AbortSignal,
): Promise<AssignedRoutesResponse> {
  assertPositiveInteger(collectorId, "collectorId");

  const payload = await httpClient.request<unknown, unknown, { id: number }>({
    method: "GET",
    path: "ruta-cobro/rutas-cobros-asignadas",
    params: { id: collectorId },
    auth: "auto",
    signal,
  });

  return parseCollectionsResponse(
    assignedRoutesResponseSchema,
    payload,
    "ASSIGNED_COLLECTION_ROUTES_INVALID_RESPONSE",
  );
}

export async function getCollectionRouteDetail(
  routeId: number,
  signal?: AbortSignal,
): Promise<CollectionRouteDetail> {
  assertPositiveInteger(routeId, "routeId");

  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `ruta-cobro/get-one-ruta-cobro/${routeId}`,
    auth: "auto",
    signal,
  });

  return parseCollectionsResponse(
    collectionRouteDetailSchema,
    payload,
    "COLLECTION_ROUTE_DETAIL_INVALID_RESPONSE",
  );
}

export async function createCollectionPayment(
  input: CreateCollectionPaymentInput,
  signal?: AbortSignal,
): Promise<void> {
  /*
   * El endpoint actual realiza la operación pero no retorna un DTO estable.
   * Por eso validamos estrictamente la entrada y tratamos la respuesta como
   * un detalle de transporte que no debe filtrarse hacia la UI.
   */
  await httpClient.request<unknown, CreateCollectionPaymentInput>({
    method: "POST",
    path: "facturacion/create-new-payment-for-ruta",
    body: input,
    auth: "auto",
    signal,
  });
}

export async function getCollectionInvoiceReceipt(
  invoiceId: number,
  signal?: AbortSignal,
): Promise<CollectionInvoiceReceipt> {
  assertPositiveInteger(invoiceId, "invoiceId");

  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `facturacion/factura-to-pdf/${invoiceId}`,
    auth: "auto",
    signal,
  });

  return parseCollectionsResponse(
    collectionInvoiceReceiptSchema,
    payload,
    "COLLECTION_INVOICE_RECEIPT_INVALID_RESPONSE",
  );
}
