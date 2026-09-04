import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { appConfig } from "@/core/config";

import { createHttpClient, httpClient } from "@/core/http";

import { isNetworkOffline, networkManager } from "@/core/network";

import {
  notificationsRuntime,
  type NativePushToken,
} from "@/core/notifications/notifications.runtime";

import { sessionTokenProvider } from "@/core/session";

import { secureStorage } from "@/core/storage";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const PUSH_INSTALLATION_ID_KEY = "nova.push.installation-id.v1";

const REGISTER_PATH = "push-dispositivos/register";

const REVOKE_PATH = "push-dispositivos/current";

/*
 * =========================================================
 * STATE
 * =========================================================
 */

let consumers = 0;

let currentAccessToken: string | null = null;

let currentPushToken: NativePushToken | null = null;

let lastRegisteredAccessToken: string | null = null;

let lastRegisteredPushToken: string | null = null;

/*
 * Si hacemos logout sin Internet conservamos temporalmente
 * el token JWT anterior EN MEMORIA para intentar revocar
 * cuando vuelva la conectividad.
 *
 * Nunca se persiste.
 */
let pendingRevokeAccessToken: string | null = null;

let releaseNotifications: (() => void) | null = null;

let unsubscribePushToken: (() => void) | null = null;

let unsubscribeSession: (() => void) | null = null;

let unsubscribeNetwork: (() => void) | null = null;

/*
 * Serializamos sincronizaciones para evitar:
 *
 * login + FCM token + network reconnect
 *
 * provocando tres registros simultáneos.
 */
let syncChain: Promise<void> = Promise.resolve();

/*
 * =========================================================
 * INSTALLATION ID
 * =========================================================
 *
 * Identifica ESTA instalación de NOVA.
 *
 * usuarioId lo obtiene el Server desde el JWT.
 * =========================================================
 */

async function getOrCreateInstallationId(): Promise<string> {
  const existing = await secureStorage.getItem(PUSH_INSTALLATION_ID_KEY);

  if (existing?.trim()) {
    return existing.trim();
  }

  const installationId = Crypto.randomUUID();

  await secureStorage.setItem(PUSH_INSTALLATION_ID_KEY, installationId);

  return installationId;
}

/*
 * DEVICE METADATA
 */

function getDeviceMetadata() {
  return {
    nombreDispositivo: Device.deviceName ?? undefined,

    modeloDispositivo: Device.modelName ?? undefined,

    versionApp: Constants.expoConfig?.version ?? undefined,
  };
}

/*
 * REGISTER
 */

async function registerCurrentDevice(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  const accessToken = currentAccessToken;

  const pushToken = currentPushToken;

  if (!accessToken || !pushToken) {
    return;
  }

  /*
   * Nuestro Server actual está configurado para Android/FCM.
   */
  if (pushToken.type.toLowerCase() !== "fcm") {
    if (__DEV__) {
      console.warn("[push-registration] El token nativo no pertenece a FCM.");
    }

    return;
  }

  if (isNetworkOffline(networkManager.getSnapshot())) {
    return;
  }

  /*
   * Evitamos registrar repetidamente el mismo estado.
   */
  if (
    lastRegisteredAccessToken === accessToken &&
    lastRegisteredPushToken === pushToken.data
  ) {
    return;
  }

  const installationId = await getOrCreateInstallationId();

  /*
   * Estado pudo cambiar mientras SecureStore respondía.
   */
  if (
    currentAccessToken !== accessToken ||
    currentPushToken?.data !== pushToken.data
  ) {
    return;
  }

  await httpClient.request({
    method: "POST",

    path: REGISTER_PATH,

    auth: "auto",

    body: {
      instalacionId: installationId,

      token: pushToken.data,

      ...getDeviceMetadata(),
    },
  });

  /*
   * Sólo marcamos éxito si el estado sigue siendo el mismo.
   */
  if (
    currentAccessToken === accessToken &&
    currentPushToken?.data === pushToken.data
  ) {
    lastRegisteredAccessToken = accessToken;

    lastRegisteredPushToken = pushToken.data;
  }

  if (__DEV__) {
    console.info("[push-registration] Dispositivo registrado correctamente.", {
      provider: pushToken.type,

      /*
       * Nunca imprimimos el token.
       */
      tokenAvailable: true,
    });
  }
}

/*
 * REVOKE
 */

async function revokeCurrentDevice(accessToken: string): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  if (isNetworkOffline(networkManager.getSnapshot())) {
    return false;
  }

  const installationId = await secureStorage.getItem(PUSH_INSTALLATION_ID_KEY);

  if (!installationId) {
    return true;
  }

  /*
   * En este momento Session puede haber borrado ya el token.
   *
   * Por eso construimos un cliente temporal cuyo único
   * token es el JWT ANTERIOR al logout.
   */
  const logoutHttpClient = createHttpClient({
    baseUrl: appConfig.api.baseUrl,

    timeoutMs: appConfig.api.timeoutMs,

    tokenProvider: {
      getAccessToken() {
        return accessToken;
      },

      subscribe() {
        return () => {};
      },
    },
  });

  await logoutHttpClient.request({
    method: "DELETE",

    path: REVOKE_PATH,

    auth: "auto",

    body: {
      instalacionId: installationId,
    },
  });

  if (__DEV__) {
    console.info("[push-registration] Dispositivo revocado tras logout.");
  }

  return true;
}

/*
 * SYNC
 */

async function performSync(): Promise<void> {
  /*
   * Primero intentamos resolver un logout pendiente.
   */
  if (pendingRevokeAccessToken) {
    try {
      const revoked = await revokeCurrentDevice(pendingRevokeAccessToken);

      if (revoked) {
        pendingRevokeAccessToken = null;
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(
          "[push-registration] No fue posible revocar todavía el dispositivo.",
          error,
        );
      }

      /*
       * Conservamos el JWT anterior únicamente en memoria.
       * Un próximo evento de red volverá a intentarlo.
       */
      return;
    }
  }

  try {
    await registerCurrentDevice();
  } catch (error) {
    if (__DEV__) {
      console.warn(
        "[push-registration] No fue posible sincronizar el dispositivo.",
        error,
      );
    }
  }
}

function scheduleSync(): void {
  syncChain = syncChain.then(performSync, performSync);
}

/*
 * START / STOP
 */

function start(): () => void {
  consumers += 1;

  if (consumers === 1) {
    /*
     * Estado inicial.
     */
    currentAccessToken = sessionTokenProvider.getAccessToken();

    currentPushToken = notificationsRuntime.getSnapshot().pushToken;

    /*
     * Inicializa:
     *
     * channel
     * permiso
     * FCM
     * token
     * listener de rotación
     */
    releaseNotifications = notificationsRuntime.start();

    /*
     * TOKEN FCM NUEVO / ROTADO
     */
    unsubscribePushToken = notificationsRuntime.subscribePushToken((token) => {
      currentPushToken = token;

      lastRegisteredPushToken = null;

      scheduleSync();
    });

    /*
     * LOGIN / LOGOUT / REFRESH JWT
     */
    unsubscribeSession = sessionTokenProvider.subscribe((nextAccessToken) => {
      const previousAccessToken = currentAccessToken;

      currentAccessToken = nextAccessToken;

      lastRegisteredAccessToken = null;

      /*
       * Logout real:
       *
       * token anterior != null
       * token nuevo = null
       */
      if (previousAccessToken && !nextAccessToken) {
        pendingRevokeAccessToken = previousAccessToken;

        lastRegisteredPushToken = null;
      }

      scheduleSync();
    });

    /*
     * Si el registro falló porque arrancamos offline,
     * un reconnect vuelve a intentarlo.
     */
    unsubscribeNetwork = networkManager.subscribe((network) => {
      if (!isNetworkOffline(network)) {
        scheduleSync();
      }
    });

    scheduleSync();
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

    unsubscribeNetwork?.();
    unsubscribeNetwork = null;

    unsubscribeSession?.();
    unsubscribeSession = null;

    unsubscribePushToken?.();
    unsubscribePushToken = null;

    releaseNotifications?.();
    releaseNotifications = null;

    /*
     * NO revocamos aquí.
     *
     * Cerrar/matar la app debe conservar el dispositivo
     * registrado precisamente para poder recibir FCM.
     *
     * Sólo logout revoca.
     */
  };
}

export const appPushRegistrationRuntime = Object.freeze({
  start,
});
