import { CheckCircle2, Clock } from "lucide-react-native";

import { AppCard, AppIcon, AppStack, AppText } from "@/design-system";

import type { FinishTrackingResponse } from "../api";

interface TrackingFinishedSummaryCardProps {
  summary: FinishTrackingResponse;
}

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

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

export function TrackingFinishedSummaryCard({
  summary,
}: TrackingFinishedSummaryCardProps) {
  return (
    <AppCard>
      <AppStack gap="lg">
        <AppStack gap="xs">
          <AppIcon icon={CheckCircle2} size="lg" tone="success" decorative />

          <AppText variant="titleMedium" weight="semibold">
            Jornada finalizada
          </AppText>

          <AppText tone="muted">
            El seguimiento fue cerrado correctamente.
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Entrada
          </AppText>

          <AppText>{formatDate(summary.horaEntrada)}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Salida
          </AppText>

          <AppText>{formatDate(summary.horaSalida)}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppIcon icon={Clock} size="sm" tone="muted" decorative />

          <AppText variant="labelMedium" tone="muted">
            Duración
          </AppText>

          <AppText>{formatDuration(summary.duracionMinutos)}</AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
