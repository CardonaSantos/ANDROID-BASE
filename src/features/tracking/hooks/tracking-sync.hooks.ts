import { useQuery } from "@tanstack/react-query";

import { getTrackingSyncStatus } from "../application";

export function trackingSyncStatusQueryKey(sessionId: number) {
  return ["tracking", "sync-status", sessionId] as const;
}

export function useTrackingSyncStatusQuery(sessionId: number) {
  return useQuery({
    queryKey: trackingSyncStatusQueryKey(sessionId),

    queryFn: () => getTrackingSyncStatus(sessionId),

    /*
     * TaskManager puede escribir en SQLite
     * sin pasar por React Query.
     *
     * Refrescamos la tarjeta periódicamente
     * mientras la pantalla esté abierta.
     */
    refetchInterval: 15_000,
  });
}
