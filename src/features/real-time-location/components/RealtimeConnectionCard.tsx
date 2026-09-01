import { useEffect } from "react";

import { Radio, RefreshCw, Wifi, WifiOff } from "lucide-react-native";

import {
  realtimeClient,
  useIsRealtimeConnected,
  useRealtimeReconnectAttempt,
  useRealtimeStatus,
  useRealtimeSuspendReason,
  type RealtimeStatus,
  type RealtimeSuspendReason,
} from "@/core/realtime";

import { AppAlert, AppCard, AppIcon, AppStack, AppText } from "@/design-system";

/*
 * =========================================================
 * LABELS
 * =========================================================
 */

function getStatusLabel(status: RealtimeStatus): string {
  switch (status) {
    case "connected":
      return "Conectado";

    case "connecting":
      return "Conectando";

    case "reconnecting":
      return "Reconectando";

    case "suspended":
      return "Suspendido";

    case "disabled":
      return "Deshabilitado";

    case "idle":
    default:
      return "Inactivo";
  }
}

function getSuspendReasonLabel(
  reason: RealtimeSuspendReason | null,
): string | null {
  switch (reason) {
    case "offline":
      return "Sin conexión de red";

    case "background":
      return "Aplicación en segundo plano";

    case "session_unavailable":
      return "Sesión no disponible";

    default:
      return null;
  }
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function RealtimeConnectionCard() {
  const status = useRealtimeStatus();

  const connected = useIsRealtimeConnected();

  const suspendReason = useRealtimeSuspendReason();

  const reconnectAttempt = useRealtimeReconnectAttempt();

  const suspendReasonLabel = getSuspendReasonLabel(suspendReason);

  /*
   * =======================================================
   * DEVELOPMENT DIAGNOSTICS
   * =======================================================
   *
   * status="connected" solamente ocurre después del
   * evento real Socket.IO "connect".
   *
   * Nunca imprimimos:
   *
   * - JWT;
   * - payloads;
   * - coordenadas;
   * - datos privados del técnico.
   * =======================================================
   */

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    const snapshot = realtimeClient.getSnapshot();

    console.info("[realtime] Estado Socket.IO:", {
      status: snapshot.status,

      configured: snapshot.configured,

      reconnectAttempt: snapshot.reconnectAttempt,

      suspendReason: snapshot.suspendReason,

      connectedAt:
        snapshot.connectedAt === null
          ? null
          : new Date(snapshot.connectedAt).toISOString(),

      disconnectedAt:
        snapshot.disconnectedAt === null
          ? null
          : new Date(snapshot.disconnectedAt).toISOString(),
    });

    if (snapshot.status === "connected") {
      console.info("[realtime] Socket.IO conectado correctamente al CRM.");
    }
  }, [status, reconnectAttempt, suspendReason]);

  /*
   * También registramos en desarrollo los nombres
   * de eventos recibidos, pero nunca sus payloads.
   */
  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    const releaseEvents = realtimeClient.subscribeAll((event) => {
      console.info(`[realtime] Evento recibido: ${event.type}`);
    });

    const releaseErrors = realtimeClient.subscribeErrors((error) => {
      console.error("[realtime] Error Socket.IO:", error);
    });

    return () => {
      releaseErrors();

      releaseEvents();
    };
  }, []);

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppStack gap="sm">
          <AppIcon
            icon={
              connected
                ? Wifi
                : status === "reconnecting"
                  ? RefreshCw
                  : status === "connecting"
                    ? Radio
                    : WifiOff
            }
            size="lg"
            tone={connected ? "success" : "primary"}
            decorative
          />

          <AppText variant="titleMedium" weight="semibold">
            Tiempo real
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Socket.IO
          </AppText>

          <AppText tone={connected ? "success" : "muted"}>
            {getStatusLabel(status)}
          </AppText>
        </AppStack>

        {status === "reconnecting" ? (
          <AppStack gap="xs">
            <AppText variant="labelMedium" tone="muted">
              Intento de reconexión
            </AppText>

            <AppText>{reconnectAttempt}</AppText>
          </AppStack>
        ) : null}

        {suspendReasonLabel ? (
          <AppAlert tone="warning" title="Conexión suspendida">
            {suspendReasonLabel}
          </AppAlert>
        ) : null}

        {connected ? (
          <AppAlert tone="success" title="Socket conectado">
            La aplicación está conectada al canal realtime del CRM.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
