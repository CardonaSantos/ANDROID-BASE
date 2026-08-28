import { Clock, MapPin, Play } from "lucide-react-native";

import { isAppError } from "@/core/errors";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppIcon,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";
import { TrackingDeviceCard } from "./TrackingDeviceCard";

import { useStartTrackingMutation, useTrackingStateQuery } from "../hooks";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",

    timeStyle: "short",
  }).format(date);
}

function getTrackingErrorMessage(error: unknown): string {
  if (!isAppError(error)) {
    return "No se pudo consultar el estado del seguimiento.";
  }

  switch (error.kind) {
    case "network":
      return "No se pudo conectar con el servidor.";

    case "timeout":
      return "El servidor tardó demasiado en responder.";

    case "unauthorized":
      return "La sesión ya no es válida.";

    case "forbidden":
      return "No tienes autorización para utilizar esta función.";

    default:
      return "No se pudo consultar el estado del seguimiento.";
  }
}

export function TrackingScreen() {
  const trackingQuery = useTrackingStateQuery();

  const startMutation = useStartTrackingMutation();

  if (trackingQuery.isPending) {
    return (
      <AppScrollScreen>
        <AppStack gap="md">
          <AppText variant="headlineSmall" weight="semibold">
            Seguimiento GPS
          </AppText>

          <AppText tone="muted">Consultando estado...</AppText>
        </AppStack>
      </AppScrollScreen>
    );
  }

  if (trackingQuery.isError) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppText variant="headlineSmall" weight="semibold">
            Seguimiento GPS
          </AppText>

          <AppAlert tone="danger" title="No se pudo cargar el tracking">
            {getTrackingErrorMessage(trackingQuery.error)}
          </AppAlert>

          <AppButton
            variant="outlined"
            onPress={() => {
              void trackingQuery.refetch();
            }}
          >
            Reintentar
          </AppButton>
        </AppStack>
      </AppScrollScreen>
    );
  }

  const tracking = trackingQuery.data;

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            Seguimiento GPS
          </AppText>

          <AppText tone="muted">Control de jornada y ubicación.</AppText>
        </AppStack>

        {tracking.activo ? (
          <>
            <AppAlert tone="success" title="Jornada activa">
              La sesión de seguimiento se encuentra activa.
            </AppAlert>

            <AppCard>
              <AppStack gap="lg">
                <AppStack gap="xs">
                  <AppIcon icon={MapPin} size="lg" tone="primary" decorative />

                  <AppText variant="titleMedium" weight="semibold">
                    Sesión #{tracking.sesionTrackingId}
                  </AppText>
                </AppStack>

                <AppStack gap="xs">
                  <AppText variant="labelMedium" tone="muted">
                    Estado
                  </AppText>

                  <AppText>{tracking.estado}</AppText>
                </AppStack>

                <AppStack gap="xs">
                  <AppText variant="labelMedium" tone="muted">
                    Inicio de jornada
                  </AppText>

                  <AppText>{formatDate(tracking.iniciadoEn)}</AppText>
                </AppStack>

                <AppStack gap="xs">
                  <AppIcon icon={Clock} size="sm" tone="muted" decorative />

                  <AppText variant="labelMedium" tone="muted">
                    Último heartbeat
                  </AppText>

                  <AppText>{formatDate(tracking.ultimoHeartbeatEn)}</AppText>
                </AppStack>
              </AppStack>
            </AppCard>

            <TrackingDeviceCard />
          </>
        ) : (
          <>
            <AppAlert tone="neutral" title="Sin jornada activa">
              Inicia una jornada para habilitar posteriormente el seguimiento
              GPS.
            </AppAlert>

            {startMutation.isError ? (
              <AppAlert tone="danger" title="No se pudo iniciar la jornada">
                {getTrackingErrorMessage(startMutation.error)}
              </AppAlert>
            ) : null}

            <AppButton
              fullWidth
              size="lg"
              leadingIcon={Play}
              loading={startMutation.isPending}
              loadingAccessibilityLabel="Iniciando jornada"
              onPress={() => {
                startMutation.mutate();
              }}
            >
              Iniciar jornada
            </AppButton>
          </>
        )}
      </AppStack>
    </AppScrollScreen>
  );
}
