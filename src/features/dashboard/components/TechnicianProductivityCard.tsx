import { CheckCircle2, Gauge } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelProductivity } from "../api";

import { formatDashboardDecimal } from "../presentation";

interface TechnicianProductivityCardProps {
  productivity: TechnicianPanelProductivity;
}

interface MetricProps {
  label: string;

  value: string | number;

  helper?: string;
}

function Metric({ label, value, helper }: MetricProps) {
  return (
    <AppStack gap="xs">
      <AppText variant="labelSmall" tone="muted">
        {label.toUpperCase()}
      </AppText>

      <AppText variant="titleLarge" weight="semibold">
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

export function TechnicianProductivityCard({
  productivity,
}: TechnicianProductivityCardProps) {
  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="lg">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppInline gap="md" align="flex-start" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppInline gap="sm" align="center">
              <AppIcon icon={CheckCircle2} size="sm" tone="danger" decorative />

              <AppText variant="titleSmall" weight="semibold">
                Productividad del mes
              </AppText>
            </AppInline>

            <AppText variant="bodySmall" tone="muted">
              Trabajo completado durante el período actual
            </AppText>
          </AppStack>

          <AppBadge tone="success" variant="soft" size="sm">
            {`${productivity.trabajosCompletados} ${
              productivity.trabajosCompletados === 1 ? "trabajo" : "trabajos"
            }`}
          </AppBadge>
        </AppInline>

        {/* ========================================= */}
        {/* MÉTRICAS */}
        {/* ========================================= */}

        <AppGrid minItemWidth={120} gap="lg">
          <Metric
            label="Instalaciones"
            value={productivity.instalacionesCompletadas}
          />

          <Metric
            label="Tickets resueltos"
            value={productivity.ticketsResueltos}
          />

          <Metric label="Días activos" value={productivity.diasConActividad} />

          <Metric
            label="Por día activo"
            value={formatDashboardDecimal(
              productivity.promedioTrabajosPorDiaActivo,
            )}
            helper="trabajos"
          />
        </AppGrid>

        {/* ========================================= */}
        {/* RITMO */}
        {/* ========================================= */}

        <AppCard variant="tonal" radius="md" padding="sm">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Gauge} size="sm" tone="default" decorative />

            <AppText variant="bodySmall">
              {`Ritmo semanal de tickets: ${formatDashboardDecimal(
                productivity.ritmoSemanalTickets,
              )}. Promedio diario: ${formatDashboardDecimal(
                productivity.promedioTicketsPorDia,
              )}.`}
            </AppText>
          </AppInline>
        </AppCard>
      </AppStack>
    </AppCard>
  );
}
