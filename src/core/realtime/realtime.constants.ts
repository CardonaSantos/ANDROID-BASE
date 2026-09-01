/*
 * =========================================================
 * REALTIME
 * =========================================================
 *
 * Socket.IO administra internamente:
 *
 * - reconnection delay
 * - maximum reconnection delay
 * - jitter
 *
 * Por eso esas constantes viven ahora junto al adapter
 * Socket.IO en realtime.manager.ts.
 *
 * Este timeout sigue siendo parte de nuestra configuración
 * común y puede sobrescribirse al crear el manager.
 * =========================================================
 */

export const REALTIME_CONNECTION_TIMEOUT_MS = 10_000;
