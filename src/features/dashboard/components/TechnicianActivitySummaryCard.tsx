import { Activity } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  TechnicianPanelActivityDay,
  TechnicianPanelActivitySummary,
} from "../api";

interface TechnicianActivitySummaryCardProps {
  summary: TechnicianPanelActivitySummary;
}

interface ActivityMetricProps {
  label: string;

  day: TechnicianPanelActivityDay | null;

  tone: "success" | "neutral";
}

function ActivityMetric({ label, day, tone }: ActivityMetricProps) {
  return (
    <AppCard variant="tonal" radius="md" padding="md">
      <AppStack gap="md">
        <AppInline gap="sm" align="flex-start" justify="space-between">
          <AppStack gap="xs" flex>
            <AppText variant="labelSmall" tone="muted">
              {label.toUpperCase()}
            </AppText>

            <AppText variant="titleSmall" weight="semibold">
              {day ? day.etiqueta : "Sin datos"}
            </AppText>
          </AppStack>

          {day ? (
            <AppBadge tone={tone} variant="soft" size="sm">
              {`${day.total} ${day.total === 1 ? "trabajo" : "trabajos"}`}
            </AppBadge>
          ) : null}
        </AppInline>

        {day ? (
          <AppText variant="bodySmall" tone="muted">
            {`${day.tickets} ${
              day.tickets === 1 ? "ticket" : "tickets"
            } · ${day.instalaciones} ${
              day.instalaciones === 1 ? "instalación" : "instalaciones"
            }`}
          </AppText>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

export function TechnicianActivitySummaryCard({
  summary,
}: TechnicianActivitySummaryCardProps) {
  const best = summary.diaMasProductivo;

  const lowest = summary.diaMenosProductivoConActividad;

  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="lg">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppStack gap="xxs">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Activity} size="sm" tone="danger" decorative />

            <AppText variant="titleSmall" weight="semibold">
              Resumen de actividad
            </AppText>
          </AppInline>

          <AppText variant="bodySmall" tone="muted">
            Días con mayor y menor producción registrada
          </AppText>
        </AppStack>

        {/* ========================================= */}
        {/* ACTIVIDAD */}
        {/* ========================================= */}

        {best ? (
          <AppGrid minItemWidth={180} gap="md">
            <ActivityMetric
              label="Día más productivo"
              day={best}
              tone="success"
            />

            <ActivityMetric
              label="Menor actividad"
              day={lowest}
              tone="neutral"
            />
          </AppGrid>
        ) : (
          <AppText variant="bodySmall" tone="muted">
            Todavía no existe actividad registrada durante este mes.
          </AppText>
        )}
      </AppStack>
    </AppCard>
  );
}
