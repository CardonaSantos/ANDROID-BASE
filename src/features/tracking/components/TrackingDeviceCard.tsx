import {
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

import { DEFAULT_TRACKING_PROFILE_ID, getTrackingProfile } from "../background";

import {
  useGrantTrackingBackgroundPermissionMutation,
  useGrantTrackingForegroundPermissionMutation,
  useTrackingDeviceStatusQuery,
  useTrackingProfileQuery,
} from "../hooks";

interface TrackingDeviceCardProps {
  journeyActive: boolean;
}

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

export function TrackingDeviceCard({ journeyActive }: TrackingDeviceCardProps) {
  const statusQuery = useTrackingDeviceStatusQuery();

  const profileQuery = useTrackingProfileQuery();

  const foregroundMutation = useGrantTrackingForegroundPermissionMutation();

  const backgroundMutation = useGrantTrackingBackgroundPermissionMutation();

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

  const profileId = profileQuery.data ?? DEFAULT_TRACKING_PROFILE_ID;

  const profile = getTrackingProfile(profileId);

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
            El servicio de ubicación se administra automáticamente según el
            estado de tu jornada.
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
              status.serviceRunning
                ? "Activo en segundo plano"
                : journeyActive
                  ? "Pendiente de activación automática"
                  : "En espera de jornada"
            }
            ok={status.serviceRunning || !journeyActive}
          />

          <StatusRow
            label="Perfil"
            value={`${profile.label} · ${
              profile.maxSendIntervalMs / 60_000
            } min / ${profile.movementThresholdMeters} m`}
            ok
          />
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
              Para mantener el seguimiento al bloquear la pantalla o usar otra
              aplicación, Android necesita este permiso.
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

        {ready && journeyActive && status.serviceRunning ? (
          <AppAlert tone="success" title="Seguimiento activo">
            La jornada está registrando ubicación en segundo plano.
          </AppAlert>
        ) : null}

        {ready && !journeyActive ? (
          <AppAlert tone="neutral" title="Dispositivo preparado">
            El seguimiento se iniciará automáticamente al comenzar la jornada.
          </AppAlert>
        ) : null}

        {ready && journeyActive && !status.serviceRunning ? (
          <AppAlert tone="info" title="Preparando seguimiento">
            La jornada está activa. El servicio de ubicación se recuperará
            automáticamente.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
