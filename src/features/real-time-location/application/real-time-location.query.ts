/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 *
 * Estructura:
 *
 * real-time-location
 * └── realtime
 *     └── technicians
 *
 * El snapshot HTTP inicial y los eventos Socket.IO
 * compartirán esta misma cache.
 *
 * Flujo futuro:
 *
 * GET tracking/realtime
 *       ↓
 * TanStack Query cache
 *       ↓
 * tracking:location-updated
 *       ↓
 * setQueryData(...)
 *       ↓
 * upsert por tecnico.id
 *       ↓
 * mapa actualizado
 * =========================================================
 */

export const realTimeLocationQueryKeys = {
  all: ["real-time-location"] as const,

  realtime: () => [...realTimeLocationQueryKeys.all, "realtime"] as const,

  technicians: () =>
    [...realTimeLocationQueryKeys.realtime(), "technicians"] as const,
};
