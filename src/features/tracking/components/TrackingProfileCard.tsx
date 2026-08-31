import { BatteryMedium, Gauge } from "lucide-react-native";

import {
  AppAlert,
  AppCard,
  AppIcon,
  AppRadio,
  AppRadioGroup,
  AppStack,
  AppText,
} from "@/design-system";

import type { TrackingProfileId } from "../background";

import {
  useChangeTrackingProfileMutation,
  useTrackingProfileQuery,
} from "../hooks";

interface TrackingProfileCardProps {
  journeyActive: boolean;
}

function isTrackingProfileId(value: string): value is TrackingProfileId {
  return value === "NORMAL" || value === "BATTERY_SAVER";
}

export function TrackingProfileCard({
  journeyActive,
}: TrackingProfileCardProps) {
  const profileQuery = useTrackingProfileQuery();

  const changeMutation = useChangeTrackingProfileMutation();

  if (profileQuery.isPending) {
    return (
      <AppCard>
        <AppText>Cargando perfil de seguimiento...</AppText>
      </AppCard>
    );
  }

  if (profileQuery.isError) {
    return (
      <AppAlert tone="danger" title="No se pudo cargar el perfil">
        No fue posible determinar la configuración del seguimiento.
      </AppAlert>
    );
  }

  const profileId = profileQuery.data;

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppStack gap="xs">
          <AppIcon
            icon={profileId === "BATTERY_SAVER" ? BatteryMedium : Gauge}
            size="lg"
            tone="primary"
            decorative
          />

          <AppText variant="titleMedium" weight="semibold">
            Perfil de seguimiento
          </AppText>
        </AppStack>

        <AppRadioGroup
          value={profileId}
          disabled={changeMutation.isPending}
          onValueChange={(value) => {
            if (!isTrackingProfileId(value) || value === profileId) {
              return;
            }

            changeMutation.mutate(value);
          }}
          gap="lg"
          accessibilityLabel="Perfil de seguimiento GPS"
        >
          <AppRadio
            value="NORMAL"
            label="Normal"
            description="Ubicación hasta cada 5 minutos o al desplazarse aproximadamente 250 metros."
          />

          <AppRadio
            value="BATTERY_SAVER"
            label="Ahorro de batería"
            description="Ubicación hasta cada 10 minutos o al desplazarse aproximadamente 250 metros."
          />
        </AppRadioGroup>

        {journeyActive ? (
          <AppAlert tone="info" title="Cambio durante la jornada">
            Cambiar el perfil no finaliza ni reinicia tu jornada.
          </AppAlert>
        ) : null}

        {changeMutation.isError ? (
          <AppAlert tone="danger" title="No se pudo cambiar el perfil">
            Se conservará la configuración anterior.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
