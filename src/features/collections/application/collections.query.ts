import { queryOptions } from "@tanstack/react-query";

import {
  getAssignedCollectionRoutes,
  getCollectionInvoiceReceipt,
  getCollectionRouteDetail,
} from "../api/collections.api";

export const collectionsQueryKeys = {
  all: ["collections"] as const,

  assigned: () => [...collectionsQueryKeys.all, "assigned"] as const,

  assignedByCollector: (collectorId: number) =>
    [...collectionsQueryKeys.assigned(), "collector", collectorId] as const,

  details: () => [...collectionsQueryKeys.all, "detail"] as const,

  detail: (routeId: number) =>
    [...collectionsQueryKeys.details(), routeId] as const,

  receipts: () => [...collectionsQueryKeys.all, "receipt"] as const,

  receipt: (invoiceId: number) =>
    [...collectionsQueryKeys.receipts(), invoiceId] as const,
};

export function assignedCollectionRoutesQueryOptions(collectorId: number) {
  return queryOptions({
    queryKey: collectionsQueryKeys.assignedByCollector(collectorId),
    queryFn: ({ signal }) => getAssignedCollectionRoutes(collectorId, signal),
    enabled: Number.isInteger(collectorId) && collectorId > 0,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}

export function collectionRouteDetailQueryOptions(routeId: number) {
  return queryOptions({
    queryKey: collectionsQueryKeys.detail(routeId),
    queryFn: ({ signal }) => getCollectionRouteDetail(routeId, signal),
    enabled: Number.isInteger(routeId) && routeId > 0,
    staleTime: 20_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}

export function collectionInvoiceReceiptQueryOptions(invoiceId: number) {
  return queryOptions({
    queryKey: collectionsQueryKeys.receipt(invoiceId),
    queryFn: ({ signal }) => getCollectionInvoiceReceipt(invoiceId, signal),
    enabled: Number.isInteger(invoiceId) && invoiceId > 0,

    /*
     * Un comprobante ya registrado cambia únicamente si la factura recibe
     * otro pago. Al entrar de nuevo a esta pantalla pedimos una copia fresca,
     * pero evitamos refetches constantes mientras permanece abierta.
     */
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}
