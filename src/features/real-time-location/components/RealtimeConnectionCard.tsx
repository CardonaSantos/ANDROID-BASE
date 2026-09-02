import { Radio, RefreshCw, Wifi, WifiOff } from "lucide-react-native";

import {
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
 *
 * Este componente solamente representa visualmente el
 * estado global de realtime.
 *
 * No abre Socket.IO.
 * No cierra Socket.IO.
 * No registra listeners de negocio.
 * No controla tracking/GPS.
 * =========================================================
 */

export function RealtimeConnectionCard() {
  const status = useRealtimeStatus();

  const connected = useIsRealtimeConnected();

  const suspendReason = useRealtimeSuspendReason();

  const reconnectAttempt = useRealtimeReconnectAttempt();

  const suspendReasonLabel = getSuspendReasonLabel(suspendReason);

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
