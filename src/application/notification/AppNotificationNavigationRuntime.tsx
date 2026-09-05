import { useEffect, useRef } from "react";

import { Platform } from "react-native";

import { useRootNavigationState, useRouter } from "expo-router";

import type { NotificationResponse } from "expo-notifications";

import { sessionTokenProvider } from "@/core/session";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface TicketAssignmentNotificationData {
  type: "ticket.assignment";

  ticketId: number;

  change: "ASSIGNED" | "UNASSIGNED";
}

/*
 * =========================================================
 * PARSER
 * =========================================================
 */

function parseTicketAssignmentNotification(
  response: NotificationResponse,
): TicketAssignmentNotificationData | null {
  const data = response.notification.request.content.data;

  if (!data || data.type !== "ticket.assignment") {
    return null;
  }

  const ticketId = Number(data.ticketId);

  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return null;
  }

  const change =
    typeof data.change === "string" ? data.change.toUpperCase() : "";

  if (change !== "ASSIGNED" && change !== "UNASSIGNED") {
    return null;
  }

  return {
    type: "ticket.assignment",

    ticketId,

    change,
  };
}

/*
 * =========================================================
 * RESPONSE KEY
 * =========================================================
 *
 * Evita procesar dos veces la misma interacción:
 *
 * - listener en caliente;
 * - lastNotificationResponse al arrancar;
 * - remount del runtime.
 * =========================================================
 */

function getResponseKey(response: NotificationResponse): string {
  return [
    response.notification.request.identifier,

    response.actionIdentifier,
  ].join(":");
}

/*
 * =========================================================
 * RUNTIME
 * =========================================================
 */

export function AppNotificationNavigationRuntime() {
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  /*
   * Respuesta pendiente mientras:
   *
   * - Navigation todavía arranca;
   * - Session todavía se hidrata.
   */
  const pendingResponseRef = useRef<NotificationResponse | null>(null);

  /*
   * Última interacción procesada.
   */
  const handledResponseKeyRef = useRef<string | null>(null);

  const navigationReady = Boolean(rootNavigationState?.key);

  useEffect(() => {
    /*
     * expo-notifications no se evalúa en Web.
     *
     * El import permanece dinámico para conservar
     * nuestro runtime web.
     */
    if (Platform.OS !== "android" && Platform.OS !== "ios") {
      return;
    }

    let active = true;

    let subscription: {
      remove(): void;
    } | null = null;

    const initialize = async () => {
      const Notifications = await import("expo-notifications");

      if (!active) {
        return;
      }

      /*
       * ===================================================
       * HANDLE RESPONSE
       * ===================================================
       */

      const handleResponse = (response: NotificationResponse) => {
        /*
         * Sólo respondemos al tap normal sobre
         * la notificación.
         */
        if (
          response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          return;
        }

        const responseKey = getResponseKey(response);

        if (handledResponseKeyRef.current === responseKey) {
          return;
        }

        const notification = parseTicketAssignmentNotification(response);

        /*
         * No es una notificación que este runtime
         * conozca.
         */
        if (!notification) {
          return;
        }

        /*
         * Una aplicación iniciada desde cero puede
         * recibir la respuesta antes de que:
         *
         * - Expo Router esté listo;
         * - SecureStore restaure la sesión.
         *
         * La conservamos temporalmente.
         */
        const hasSession = Boolean(sessionTokenProvider.getAccessToken());

        if (!navigationReady || !hasSession) {
          pendingResponseRef.current = response;

          return;
        }

        /*
         * A partir de aquí consideramos consumida
         * la interacción.
         */
        handledResponseKeyRef.current = responseKey;

        pendingResponseRef.current = null;

        /*
         * ASSIGNED
         *
         * El técnico todavía tiene acceso al ticket,
         * así que abrimos directamente el detalle.
         */
        if (notification.change === "ASSIGNED") {
          router.push({
            pathname: "/tickets/[ticketId]",

            params: {
              ticketId: String(notification.ticketId),
            },
          });
        } else {
          /*
           * UNASSIGNED
           *
           * Ya no garantizamos que el usuario tenga
           * acceso al detalle del ticket.
           *
           * Lo enviamos a su bandeja actual.
           */
          router.push("/tickets");
        }

        /*
         * Evitamos que un próximo arranque vuelva
         * a consumir la misma notificación.
         */
        void Notifications.clearLastNotificationResponseAsync().catch(() => {
          /*
           * El fallo al limpiar la respuesta no
           * debe bloquear la navegación.
           */
        });
      };

      /*
       * ===================================================
       * APP ABIERTA / BACKGROUND
       * ===================================================
       */

      subscription =
        Notifications.addNotificationResponseReceivedListener(handleResponse);

      /*
       * ===================================================
       * PENDING
       * ===================================================
       *
       * Puede provenir de una ejecución anterior
       * del efecto mientras Router/Session arrancaban.
       */

      if (pendingResponseRef.current) {
        handleResponse(pendingResponseRef.current);
      }

      /*
       * ===================================================
       * COLD START
       * ===================================================
       *
       * Si Android lanzó NOVA porque el usuario tocó
       * una notificación mientras estaba cerrada.
       */

      const lastResponse =
        await Notifications.getLastNotificationResponseAsync();

      if (active && lastResponse) {
        handleResponse(lastResponse);
      }
    };

    void initialize();

    return () => {
      active = false;

      subscription?.remove();
    };
  }, [navigationReady, router]);

  /*
   * =======================================================
   * SESSION
   * =======================================================
   *
   * Si la respuesta llegó mientras Session todavía se
   * hidrataba, necesitamos disparar nuevamente el efecto
   * cuando aparezca el JWT.
   * =======================================================
   */

  useEffect(() => {
    return sessionTokenProvider.subscribe((accessToken) => {
      if (!accessToken || !pendingResponseRef.current) {
        return;
      }

      /*
       * Forzamos un pequeño ciclo asíncrono.
       *
       * Para entonces el árbol autenticado podrá
       * terminar de montarse.
       */
      const pending = pendingResponseRef.current;

      void import("expo-notifications").then((Notifications) => {
        if (!pending || !navigationReady) {
          return;
        }

        const notification = parseTicketAssignmentNotification(pending);

        if (!notification) {
          return;
        }

        const responseKey = getResponseKey(pending);

        if (handledResponseKeyRef.current === responseKey) {
          return;
        }

        handledResponseKeyRef.current = responseKey;

        pendingResponseRef.current = null;

        if (notification.change === "ASSIGNED") {
          router.push({
            pathname: "/tickets/[ticketId]",

            params: {
              ticketId: String(notification.ticketId),
            },
          });
        } else {
          router.push("/tickets");
        }

        void Notifications.clearLastNotificationResponseAsync().catch(() => {});
      });
    });
  }, [navigationReady, router]);

  return null;
}
