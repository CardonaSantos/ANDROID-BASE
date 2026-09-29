import { useQuery } from "@tanstack/react-query";

import {
  assignedCollectionRoutesQueryOptions,
  collectionInvoiceReceiptQueryOptions,
  collectionRouteDetailQueryOptions,
} from "../application/collections.query";

export function useAssignedCollectionRoutesQuery(collectorId: number) {
  return useQuery(assignedCollectionRoutesQueryOptions(collectorId));
}

export function useCollectionRouteDetailQuery(routeId: number) {
  return useQuery(collectionRouteDetailQueryOptions(routeId));
}

export function useCollectionInvoiceReceiptQuery(invoiceId: number) {
  return useQuery(collectionInvoiceReceiptQueryOptions(invoiceId));
}
