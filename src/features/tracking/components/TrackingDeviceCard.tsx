import {
  BatteryMedium,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  Smartphone,
} from "lucide-react-native";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppIcon,
  AppStack,
  AppText,
} from "@/design-system";

import { DEFAULT_TRACKING_PROFILE_ID } from "../background";

import {
  useActivateTrackingDeviceMutation,
  useGrantTrackingBackgroundPermissionMutation,
  useGrantTrackingForegroundPermissionMutation,
  useTrackingDeviceStatusQuery,
} from "../hooks";

interface StatusRowProps {
  label: string;

  value: string;

  ok: boolean;
}

function StatusRow({ label, value, ok }: StatusRowProps) {
  return (
    <AppStack gap="xs">
      <AppText variant="labelMedium" tone="muted">
        {label}
      </AppText>

      <AppText tone={ok ? "success" : "muted"}>{value}</AppText>
    </AppStack>
  );
}

export function TrackingDeviceCard() {
  const statusQuery = useTrackingDeviceStatusQuery();

  const foregroundMutation = useGrantTrackingForegroundPermissionMutation();

  const backgroundMutation = useGrantTrackingBackgroundPermissionMutation();

  const activateMutation = useActivateTrackingDeviceMutation();

  if (statusQuery.isPending) {
    return (
      <AppCard>
        <AppText>Comprobando dispositivo...</AppText>
      </AppCard>
    );
  }

  if (statusQuery.isError) {
    return (
      <AppAlert tone="danger" title="No se pudo comprobar el dispositivo">
        No fue posible determinar el estado del servicio de ubicación.
      </AppAlert>
    );
  }

  const status = statusQuery.data;

  if (!status.supported) {
    return (
      <AppAlert tone="info" title="Disponible en Android">
        El seguimiento GPS en segundo plano requiere ejecutar la aplicación
        Android.
      </AppAlert>
    );
  }

  const foregroundGranted = status.foregroundPermission === "granted";

  const backgroundGranted = status.backgroundPermission === "granted";

  const ready =
    status.locationServicesEnabled && foregroundGranted && backgroundGranted;

  return (
    <AppCard>
      <AppStack gap="xl">
        <AppStack gap="sm">
          <AppIcon
            icon={status.serviceRunning ? CheckCircle2 : Smartphone}
            size="lg"
            tone={status.serviceRunning ? "success" : "primary"}
            decorative
          />

          <AppText variant="titleMedium" weight="semibold">
            Seguimiento del dispositivo
          </AppText>

          <AppText tone="muted">
            Estado del servicio de ubicación utilizado durante la jornada.
          </AppText>
        </AppStack>

        <AppStack gap="lg">
          <StatusRow
            label="GPS del sistema"
            value={status.locationServicesEnabled ? "Activo" : "Desactivado"}
            ok={status.locationServicesEnabled}
          />

          <StatusRow
            label="Ubicación"
            value={foregroundGranted ? "Permitida" : "Falta permiso"}
            ok={foregroundGranted}
          />

          <StatusRow
            label="Segundo plano"
            value={backgroundGranted ? "Permitido" : "Falta permiso"}
            ok={backgroundGranted}
          />

          <StatusRow
            label="Servicio de seguimiento"
            value={
              status.serviceRunning ? "Activo en segundo plano" : "Detenido"
            }
            ok={status.serviceRunning}
          />

          <StatusRow label="Perfil" value="Normal · 5 min / 250 m" ok />
        </AppStack>

        {!foregroundGranted ? (
          <AppStack gap="md">
            <AppAlert tone="info" title="Permiso de ubicación">
              La aplicación necesita acceder a tu ubicación para registrar el
              recorrido durante la jornada.
            </AppAlert>

            <AppButton
              fullWidth
              leadingIcon={MapPin}
              loading={foregroundMutation.isPending}
              onPress={() => {
                foregroundMutation.mutate();
              }}
            >
              Permitir ubicación
            </AppButton>
          </AppStack>
        ) : null}

        {foregroundGranted && !backgroundGranted ? (
          <AppStack gap="md">
            <AppAlert tone="warning" title="Ubicación en segundo plano">
              Para mantener el seguimiento cuando uses otra aplicación o
              bloquees la pantalla, Android necesita permitir ubicación en
              segundo plano.
            </AppAlert>

            <AppButton
              fullWidth
              leadingIcon={ShieldAlert}
              loading={backgroundMutation.isPending}
              onPress={() => {
                backgroundMutation.mutate();
              }}
            >
              Permitir segundo plano
            </AppButton>
          </AppStack>
        ) : null}

        {ready && !status.serviceRunning ? (
          <AppButton
            fullWidth
            size="lg"
            leadingIcon={BatteryMedium}
            loading={activateMutation.isPending}
            onPress={() => {
              activateMutation.mutate(DEFAULT_TRACKING_PROFILE_ID);
            }}
          >
            Activar seguimiento
          </AppButton>
        ) : null}

        {status.serviceRunning ? (
          <AppAlert tone="success" title="Seguimiento activo">
            El servicio de ubicación está ejecutándose en segundo plano.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
