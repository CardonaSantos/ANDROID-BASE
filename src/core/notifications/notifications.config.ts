/*
 * =========================================================
 * NOTIFICATIONS CONFIG
 * =========================================================
 *
 * Configuración agnóstica de infraestructura para las
 * notificaciones operativas de NOVA.
 *
 * No inicializa expo-notifications.
 * No solicita permisos.
 * No obtiene tokens.
 * =========================================================
 */

export const TICKETS_NOTIFICATION_CHANNEL_ID = "tickets" as const;

export const TICKETS_NOTIFICATION_CHANNEL_NAME = "Tickets" as const;

export const TICKETS_NOTIFICATION_CHANNEL_DESCRIPTION =
  "Asignaciones, reasignaciones y cambios importantes en tickets de soporte." as const;

/*
 * Patrón breve y reconocible:
 *
 * espera
 * vibración
 * pausa
 * vibración
 */
export const TICKETS_NOTIFICATION_VIBRATION_PATTERN = [0, 250, 120, 250];

/*
 * =========================================================
 * FOREGROUND POLICY
 * =========================================================
 *
 * En SDK 57 una notificación recibida mientras la app está
 * abierta NO se presenta por defecto.
 *
 * Queremos que Push sea la fuente de feedback visual:
 *
 * Socket.IO
 *   → sincroniza datos.
 *
 * Push
 *   → avisa al usuario.
 *
 * Así evitamos tener:
 *
 * Socket -> toast
 * Push   -> otra notificación
 *
 * para el mismo evento.
 * =========================================================
 */

export const NOTIFICATIONS_FOREGROUND_BEHAVIOR = {
  shouldShowBanner: true,

  shouldShowList: true,

  shouldPlaySound: true,

  shouldSetBadge: true,
} as const;
