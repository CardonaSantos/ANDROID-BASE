import { MapPinned } from "lucide-react-native";

import {
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import { useTrackingStateQuery } from "@/features/tracking";

interface TechnicianJourneyCardProps {
  onOpen: () => void;
}

export function TechnicianJourneyCard({ onOpen }: TechnicianJourneyCardProps) {
  const trackingQuery = useTrackingStateQuery();

  const state = trackingQuery.data;

  const active = state?.activo === true;

  return (
    <AppCard
      onPress={onOpen}
      accessibilityLabel="Seguimiento GPS"
      accessibilityHint="Abrir jornada y seguimiento de ubicación"
    >
      <AppInline gap="md" align="center">
        <AppIcon
          icon={MapPinned}
          size="lg"
          tone={active ? "success" : "muted"}
          decorative
        />

        <AppStack gap="xs" flex>
          <AppText variant="titleMedium" weight="semibold">
            {active ? "Jornada activa" : "Jornada sin iniciar"}
          </AppText>

          {trackingQuery.isPending ? (
            <AppText variant="bodySmall" tone="muted">
              Consultando seguimiento...
            </AppText>
          ) : trackingQuery.isError ? (
            <AppText variant="bodySmall" tone="muted">
              No fue posible consultar el estado. Toca para revisar.
            </AppText>
          ) : active && state ? (
            <AppText variant="bodySmall" tone="muted">
              Sesión #{state.sesionTrackingId} · Seguimiento GPS habilitado
            </AppText>
          ) : (
            <AppText variant="bodySmall" tone="muted">
              Inicia tu jornada para activar el seguimiento.
            </AppText>
          )}
        </AppStack>
      </AppInline>
    </AppCard>
  );
}
