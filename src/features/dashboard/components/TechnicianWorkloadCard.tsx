import { AlertTriangle, ClipboardList } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelWorkload } from "../api";

interface TechnicianWorkloadCardProps {
  workload: TechnicianPanelWorkload;
}

interface MetricProps {
  label: string;

  value: number;

  helper: string;
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

      <AppText variant="bodySmall" tone="muted">
        {helper}
      </AppText>
    </AppStack>
  );
}

export function TechnicianWorkloadCard({
  workload,
}: TechnicianWorkloadCardProps) {
  const hasAccumulatedWork =
    workload.ticketsConMas48Horas > 0 || workload.instalacionesAtrasadas > 0;

  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="lg">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppInline gap="md" align="flex-start" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppInline gap="sm" align="center">
              <AppIcon
                icon={ClipboardList}
                size="sm"
                tone="default"
                decorative
              />

              <AppText variant="titleSmall" weight="semibold">
                Carga actual
              </AppText>
            </AppInline>

            <AppText variant="bodySmall" tone="muted">
              Trabajo pendiente y prioridades
            </AppText>
          </AppStack>

          <AppInline gap="xs" align="center" wrap>
            {workload.ticketsUrgentes > 0 ? (
              <AppBadge tone="danger" variant="soft" size="sm">
                {`${workload.ticketsUrgentes} ${
                  workload.ticketsUrgentes === 1 ? "urgente" : "urgentes"
                }`}
              </AppBadge>
            ) : null}

            {workload.instalacionesAtrasadas > 0 ? (
              <AppBadge tone="warning" variant="soft" size="sm">
                {`${workload.instalacionesAtrasadas} atrasadas`}
              </AppBadge>
            ) : null}
          </AppInline>
        </AppInline>

        {/* ========================================= */}
        {/* MÉTRICAS */}
        {/* ========================================= */}

        <AppGrid minItemWidth={120} gap="lg">
          <Metric
            label="Tickets"
            value={workload.ticketsPendientes}
            helper={`${workload.ticketsListosParaTrabajar} listos`}
          />

          <Metric
            label="Urgentes"
            value={workload.ticketsUrgentes}
            helper={`${workload.ticketsConMas48Horas} con +48 h`}
          />

          <Metric
            label="Instalaciones"
            value={workload.instalacionesPendientes}
            helper="Pendientes"
          />

          <Metric
            label="Atrasadas"
            value={workload.instalacionesAtrasadas}
            helper={`${workload.instalacionesProgramadasHoy} para hoy`}
          />
        </AppGrid>

        {/* ========================================= */}
        {/* TRABAJO ACUMULADO */}
        {/* ========================================= */}

        {hasAccumulatedWork ? (
          <AppCard variant="tonal" radius="md" padding="sm">
            <AppInline gap="sm" align="flex-start">
              <AppIcon
                icon={AlertTriangle}
                size="sm"
                tone="warning"
                decorative
              />

              <AppText
                variant="bodySmall"
                // flex
              >
                {`Hay trabajo acumulado que requiere atención: ${workload.ticketsConMas48Horas} ${
                  workload.ticketsConMas48Horas === 1 ? "ticket" : "tickets"
                } superan 48 horas y ${workload.instalacionesAtrasadas} ${
                  workload.instalacionesAtrasadas === 1
                    ? "instalación está atrasada"
                    : "instalaciones están atrasadas"
                }.`}
              </AppText>
            </AppInline>
          </AppCard>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
