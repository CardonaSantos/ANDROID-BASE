import { Clock3 } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelTimes } from "../api";

import { formatMinutesDuration } from "../presentation";

interface TechnicianTimesCardProps {
  times: TechnicianPanelTimes;
}

interface TimeMetricProps {
  label: string;

  value: string;
}

function TimeMetric({ label, value }: TimeMetricProps) {
  return (
    <AppCard variant="tonal" radius="md" padding="md">
      <AppStack gap="xs">
        <AppText variant="labelSmall" tone="muted">
          {label.toUpperCase()}
        </AppText>

        <AppText variant="titleMedium" weight="semibold">
          {value}
        </AppText>
      </AppStack>
    </AppCard>
  );
}

export function TechnicianTimesCard({ times }: TechnicianTimesCardProps) {
  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="lg">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppStack gap="xxs">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Clock3} size="sm" tone="default" decorative />

            <AppText variant="titleSmall" weight="semibold">
              Tiempos promedio
            </AppText>
          </AppInline>

          <AppText variant="bodySmall" tone="muted">
            Duración registrada de los trabajos completados
          </AppText>
        </AppStack>

        {/* ========================================= */}
        {/* MÉTRICAS */}
        {/* ========================================= */}

        <AppGrid minItemWidth={180} gap="md">
          <TimeMetric
            label="Resolución de ticket"
            value={formatMinutesDuration(times.promedioResolucionTicketMinutos)}
          />

          <TimeMetric
            label="Instalación"
            value={formatMinutesDuration(times.promedioInstalacionMinutos)}
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
