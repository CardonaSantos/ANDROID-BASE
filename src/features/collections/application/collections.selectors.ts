import type {
  CollectionClient,
  CollectionRouteDetail,
} from "../api/collections.contracts.api";

export function getCollectionRoutePendingInvoiceCount(
  route: CollectionRouteDetail,
): number {
  return route.clientes.reduce(
    (total, client) => total + client.facturas.length,
    0,
  );
}

export function getCollectionRouteDebtTotal(
  route: CollectionRouteDetail,
): number {
  return route.clientes.reduce(
    (total, client) => total + client.totalDebe,
    0,
  );
}

export function getMappableCollectionClients(
  clients: readonly CollectionClient[],
): CollectionClient[] {
  return clients.filter((client) => {
    const location = client.ubicacion;

    if (!location) {
      return false;
    }

    return (
      Number.isFinite(location.latitud) &&
      Number.isFinite(location.longitud) &&
      Math.abs(location.latitud) <= 90 &&
      Math.abs(location.longitud) <= 180
    );
  });
}

export function findCollectionClient(
  clients: readonly CollectionClient[],
  clientId: number | null,
): CollectionClient | null {
  if (clientId === null) {
    return null;
  }

  return clients.find((client) => client.id === clientId) ?? null;
}
