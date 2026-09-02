import type { RealtimeFeatureBinding } from "@/core/realtime/realtime-handlers";

import { realTimeLocationRealtimeBinding } from "@/features/real-time-location/realtime";

import { ticketsRealtimeBinding } from "@/features/tickets/realtime";

/**
 * Realtime feature bindings activos en la aplicación.
 *
 * Cada feature es responsable de:
 *
 * - definir sus nombres de evento;
 * - validar el payload recibido;
 * - decidir cómo actualizar su estado/query cache;
 * - exponer un binding listo para registrar aquí.
 *
 * No colocar lógica de negocio directamente en este archivo.
 */
export const appRealtimeFeatureBindings: readonly RealtimeFeatureBinding[] = [
  realTimeLocationRealtimeBinding,

  ticketsRealtimeBinding,
];
