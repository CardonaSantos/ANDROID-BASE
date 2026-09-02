import { Platform } from "react-native";

import { toAppError, type AppError } from "@/core/errors";

import {
  NOTIFICATIONS_FOREGROUND_BEHAVIOR,
  TICKETS_NOTIFICATION_CHANNEL_DESCRIPTION,
  TICKETS_NOTIFICATION_CHANNEL_ID,
  TICKETS_NOTIFICATION_CHANNEL_NAME,
  TICKETS_NOTIFICATION_VIBRATION_PATTERN,
} from "./notifications.config";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ExpoNotificationsModule = typeof import("expo-notifications");

export type NotificationsRuntimeStatus =
  | "idle"
  | "unsupported"
  | "initializing"
  | "permission_denied"
  | "ready"
  | "error";

export interface NativePushToken {
  /*
   * Android:
   *
   * type = "fcm"
   *
   * Dejamos string para no acoplar nuestro contrato interno
   * a los tipos públicos de Expo.
   */
  type: string;

  data: string;
}

export interface NotificationsRuntimeSnapshot {
  status: NotificationsRuntimeStatus;

  permissionStatus: string | null;

  pushToken: NativePushToken | null;

  error: AppError | null;
}

export type NotificationsRuntimeListener = (
  snapshot: NotificationsRuntimeSnapshot,
) => void;

export type PushTokenListener = (token: NativePushToken | null) => void;

/*
 * =========================================================
 * STATE
 * =========================================================
 */

let consumers = 0;

let lifecycleVersion = 0;

let currentSnapshot: NotificationsRuntimeSnapshot = {
  status: "idle",

  permissionStatus: null,

  pushToken: null,

  error: null,
};

const snapshotListeners = new Set<NotificationsRuntimeListener>();

const pushTokenListeners = new Set<PushTokenListener>();

/*
 * Suscripción nativa entregada por expo-notifications.
 */
let pushTokenSubscription: {
  remove(): void;
} | null = null;

/*
 * Evitamos evaluar expo-notifications en web.
 *
 * La librería no soporta Web Push.
 */
let notificationsModulePromise: Promise<ExpoNotificationsModule> | null = null;

/*
 * setNotificationHandler es global.
 *
 * Sólo necesitamos configurarlo una vez durante la vida
 * del runtime JavaScript.
 */
let foregroundHandlerConfigured = false;

/*
 * =========================================================
 * SNAPSHOT
 * =========================================================
 */

function getSnapshot(): NotificationsRuntimeSnapshot {
  return currentSnapshot;
}

function emitSnapshot(): void {
  for (const listener of snapshotListeners) {
    try {
      listener(currentSnapshot);
    } catch {
      /*
       * Un observer no debe romper el runtime.
       */
    }
  }
}

function setSnapshot(patch: Partial<NotificationsRuntimeSnapshot>): void {
  currentSnapshot = {
    ...currentSnapshot,

    ...patch,
  };

  emitSnapshot();
}

function subscribe(listener: NotificationsRuntimeListener): () => void {
  snapshotListeners.add(listener);

  return () => {
    snapshotListeners.delete(listener);
  };
}

/*
 * =========================================================
 * PUSH TOKEN OBSERVERS
 * =========================================================
 *
 * La siguiente capa del proyecto utilizará esto para:
 *
 * token FCM
 *    ↓
 * POST /push-devices/register
 *    ↓
 * Server
 *
 * Si Firebase rota el token, los observers recibirán
 * automáticamente el nuevo valor.
 * =========================================================
 */

function emitPushToken(token: NativePushToken | null): void {
  for (const listener of pushTokenListeners) {
    try {
      listener(token);
    } catch {
      /*
       * Aislamiento entre consumidores.
       */
    }
  }
}

function subscribePushToken(listener: PushTokenListener): () => void {
  pushTokenListeners.add(listener);

  /*
   * Entregamos inmediatamente el valor conocido.
   *
   * Esto evita condiciones de carrera si el Server registra
   * su observer después de que FCM ya devolvió el token.
   */
  if (currentSnapshot.pushToken) {
    try {
      listener(currentSnapshot.pushToken);
    } catch {
      // Observer aislado.
    }
  }

  return () => {
    pushTokenListeners.delete(listener);
  };
}

/*
 * =========================================================
 * PLATFORM
 * =========================================================
 */

function isSupportedPlatform(): boolean {
  /*
   * expo-notifications no soporta Web Push.
   *
   * Android es nuestro objetivo actual.
   *
   * Dejamos iOS habilitado estructuralmente para una futura
   * configuración APNs.
   */
  return Platform.OS === "android" || Platform.OS === "ios";
}

/*
 * =========================================================
 * MODULE LOADING
 * =========================================================
 */

async function getNotificationsModule(): Promise<ExpoNotificationsModule> {
  if (!notificationsModulePromise) {
    notificationsModulePromise = import("expo-notifications");
  }

  return notificationsModulePromise;
}

/*
 * =========================================================
 * FOREGROUND HANDLER
 * =========================================================
 */

function configureForegroundHandler(
  Notifications: ExpoNotificationsModule,
): void {
  if (foregroundHandlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => NOTIFICATIONS_FOREGROUND_BEHAVIOR,

    handleError(notificationId, error) {
      if (__DEV__) {
        console.error(
          `[notifications] Error presentando ${notificationId}.`,
          error,
        );
      }
    },
  });

  foregroundHandlerConfigured = true;
}

/*
 * =========================================================
 * ANDROID CHANNEL
 * =========================================================
 */

async function configureAndroidChannels(
  Notifications: ExpoNotificationsModule,
): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  /*
   * Android 13 necesita que exista al menos un canal antes
   * de poder presentar correctamente el prompt de permiso.
   *
   * También debemos crearlo antes de pedir el FCM token.
   */
  await Notifications.setNotificationChannelAsync(
    TICKETS_NOTIFICATION_CHANNEL_ID,
    {
      name: TICKETS_NOTIFICATION_CHANNEL_NAME,

      description: TICKETS_NOTIFICATION_CHANNEL_DESCRIPTION,

      importance: Notifications.AndroidImportance.HIGH,

      sound: "default",

      vibrationPattern: [...TICKETS_NOTIFICATION_VIBRATION_PATTERN],

      enableVibrate: true,

      showBadge: true,

      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,

      bypassDnd: false,
    },
  );
}

/*
 * =========================================================
 * PERMISSIONS
 * =========================================================
 */

async function ensurePermission(
  Notifications: ExpoNotificationsModule,
): Promise<string> {
  const existing = await Notifications.getPermissionsAsync();

  if (existing.status === "granted") {
    return existing.status;
  }

  /*
   * El SO puede indicar que ya no podemos volver a pedir
   * permiso programáticamente.
   *
   * En ese caso posteriormente podremos dirigir al usuario
   * a Ajustes desde la UI.
   */
  if (!existing.canAskAgain) {
    return existing.status;
  }

  const requested = await Notifications.requestPermissionsAsync();

  return requested.status;
}

/*
 * =========================================================
 * TOKEN NORMALIZATION
 * =========================================================
 */

function normalizePushToken(
  token: Awaited<
    ReturnType<ExpoNotificationsModule["getDevicePushTokenAsync"]>
  >,
): NativePushToken {
  /*
   * Android FCM devuelve string.
   *
   * Web podría devolver PushSubscription, pero Web está
   * bloqueado antes de llegar aquí.
   */
  if (typeof token.data !== "string") {
    throw new Error(
      "El proveedor devolvió un push token nativo no compatible.",
    );
  }

  return {
    type: String(token.type),

    data: token.data,
  };
}

function applyPushToken(token: NativePushToken): void {
  const previous = currentSnapshot.pushToken;

  /*
   * No notificamos una rotación que realmente no cambió.
   */
  if (previous?.type === token.type && previous.data === token.data) {
    return;
  }

  setSnapshot({
    pushToken: token,
  });

  emitPushToken(token);
}

/*
 * =========================================================
 * TOKEN ROTATION
 * =========================================================
 */

function attachPushTokenListener(Notifications: ExpoNotificationsModule): void {
  pushTokenSubscription?.remove();

  pushTokenSubscription = Notifications.addPushTokenListener((token) => {
    try {
      const normalized = normalizePushToken(token);

      applyPushToken(normalized);

      if (__DEV__) {
        /*
         * Deliberadamente NO imprimimos el token.
         */
        console.info("[notifications] Token push nativo actualizado.");
      }
    } catch (cause) {
      const error = toAppError(cause, {
        kind: "unknown",

        source: "application",

        code: "PUSH_TOKEN_ROTATION_FAILED",

        message: "No fue posible procesar la actualización del token push.",
      });

      setSnapshot({
        status: "error",

        error,
      });
    }
  });
}

/*
 * =========================================================
 * INITIALIZATION
 * =========================================================
 */

function isCurrentLifecycle(version: number): boolean {
  return version === lifecycleVersion && consumers > 0;
}

async function initialize(version: number): Promise<void> {
  if (!isSupportedPlatform()) {
    if (!isCurrentLifecycle(version)) {
      return;
    }

    setSnapshot({
      status: "unsupported",

      permissionStatus: null,

      pushToken: null,

      error: null,
    });

    return;
  }

  setSnapshot({
    status: "initializing",

    error: null,
  });

  try {
    const Notifications = await getNotificationsModule();

    if (!isCurrentLifecycle(version)) {
      return;
    }

    /*
     * Orden importante:
     *
     * 1. handler foreground
     * 2. Android channel
     * 3. permiso
     * 4. listener de rotación
     * 5. token FCM/APNs
     */

    configureForegroundHandler(Notifications);

    await configureAndroidChannels(Notifications);

    if (!isCurrentLifecycle(version)) {
      return;
    }

    const permissionStatus = await ensurePermission(Notifications);

    if (!isCurrentLifecycle(version)) {
      return;
    }

    setSnapshot({
      permissionStatus,
    });

    if (permissionStatus !== "granted") {
      setSnapshot({
        status: "permission_denied",

        pushToken: null,

        error: null,
      });

      return;
    }

    attachPushTokenListener(Notifications);

    const rawToken = await Notifications.getDevicePushTokenAsync();

    if (!isCurrentLifecycle(version)) {
      return;
    }

    const pushToken = normalizePushToken(rawToken);

    applyPushToken(pushToken);

    setSnapshot({
      status: "ready",

      permissionStatus: "granted",

      pushToken,

      error: null,
    });

    if (__DEV__) {
      console.info("[notifications] Push nativo listo.", {
        provider: pushToken.type,

        /*
         * Nunca mostramos el token real.
         */
        tokenAvailable: true,
      });
    }
  } catch (cause) {
    if (!isCurrentLifecycle(version)) {
      return;
    }

    const error = toAppError(cause, {
      kind: "unknown",

      source: "application",

      code: "PUSH_NOTIFICATIONS_INIT_FAILED",

      message: "No fue posible inicializar las notificaciones push.",
    });

    setSnapshot({
      status: "error",

      error,
    });

    if (__DEV__) {
      console.error("[notifications] Inicialización fallida.", error);
    }
  }
}

/*
 * =========================================================
 * DETACH
 * =========================================================
 */

function detach(): void {
  pushTokenSubscription?.remove();

  pushTokenSubscription = null;

  /*
   * No eliminamos el FCM token del dispositivo.
   *
   * La asociación usuario <-> dispositivo se gestionará
   * posteriormente con nuestro Server.
   */
  setSnapshot({
    status: "idle",

    error: null,
  });
}

/*
 * =========================================================
 * RUNTIME
 * =========================================================
 */

function start(): () => void {
  consumers += 1;

  if (consumers === 1) {
    lifecycleVersion += 1;

    const version = lifecycleVersion;

    void initialize(version);
  }

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;

    consumers = Math.max(0, consumers - 1);

    if (consumers !== 0) {
      return;
    }

    lifecycleVersion += 1;

    detach();
  };
}

export const notificationsRuntime = Object.freeze({
  start,

  getSnapshot,

  subscribe,

  subscribePushToken,
});
