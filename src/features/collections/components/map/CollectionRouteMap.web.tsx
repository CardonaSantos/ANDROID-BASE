import { AppAlert } from "@/design-system";

import type { CollectionClient } from "../../api/collections.contracts.api";

export interface CollectionRouteMapProps {
  clients: readonly CollectionClient[];
  selectedClientId: number | null;
  height?: number;
  onSelectClient: (clientId: number) => void;
}

export function CollectionRouteMap({
  clients,
}: CollectionRouteMapProps) {
  return (
    <AppAlert tone="info" title="Mapa disponible en Android">
      {clients.length > 0
        ? `${clients.length} ubicaciones listas para mostrarse en la aplicación móvil.`
        : "Esta ruta no tiene ubicaciones válidas."}
    </AppAlert>
  );
}
