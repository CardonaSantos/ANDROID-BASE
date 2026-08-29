import { Clock3, Gauge } from "lucide-react-native";

import {
  AppAlert,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelProductivity, TechnicianPanelTimes } from "../api";

import { formatDashboardDecimal, formatMinutesDuration } from "../presentation";

interface TechnicianPerformanceCardProps {
  productivity: TechnicianPanelProductivity;

  times: TechnicianPanelTimes;
}

interface MetricProps {
  label: string;

  value: string | number;

  helper?: string;
}

function Metric({ label, value, helper }: MetricProps) {
  return (
    <AppStack gap="xs">
      <AppText variant="labelMedium" tone="muted">
        {label}
      </AppText>

      <AppText variant="titleMedium" weight="semibold">
        {value}
      </AppText>

      {helper ? (
        <AppText variant="bodySmall" tone="muted">
          {helper}
        </AppText>
      ) : null}
    </AppStack>
  );
}

export function TechnicianPerformanceCard({
  productivity,
  times,
}: TechnicianPerformanceCardProps) {
  return (
    <AppCard>
      <AppStack gap="xl">
        <AppInline gap="sm" align="center">
          <AppIcon icon={Gauge} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Productividad del mes
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              Trabajo completado durante el período actual
            </AppText>
          </AppStack>
        </AppInline>

        <AppGrid minItemWidth={130} gap="lg">
          <Metric label="Trabajos" value={productivity.trabajosCompletados} />

          <Metric
            label="Tickets resueltos"
            value={productivity.ticketsResueltos}
          />

          <Metric
            label="Instalaciones"
            value={productivity.instalacionesCompletadas}
          />

          <Metric label="Días activos" value={productivity.diasConActividad} />
        </AppGrid>

        <AppAlert tone="info" title="Ritmo de trabajo">
          Ritmo semanal de tickets:{" "}
          {formatDashboardDecimal(productivity.ritmoSemanalTickets)}. Promedio
          diario: {formatDashboardDecimal(productivity.promedioTicketsPorDia)}.
        </AppAlert>

        <AppStack gap="md">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Clock3} size="sm" tone="muted" decorative />

            <AppText variant="titleMedium" weight="semibold">
              Tiempos promedio
            </AppText>
          </AppInline>

          <AppGrid minItemWidth={150} gap="lg">
            <Metric
              label="Resolución de ticket"
              value={formatMinutesDuration(
                times.promedioResolucionTicketMinutos,
              )}
            />

            <Metric
              label="Instalación"
              value={formatMinutesDuration(times.promedioInstalacionMinutos)}
            />
          </AppGrid>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
