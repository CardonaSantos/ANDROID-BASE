import { AlertTriangle, ClipboardList } from "lucide-react-native";

import {
  AppAlert,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelWorkload } from "../api";

import { hasTechnicianPriorityAttention } from "../presentation";

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
      <AppText variant="labelMedium" tone="muted">
        {label}
      </AppText>

      <AppText variant="titleMedium" weight="semibold">
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
  const requiresAttention = hasTechnicianPriorityAttention(workload);

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppInline gap="sm" align="center">
          <AppIcon icon={ClipboardList} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Carga actual
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              Trabajo pendiente y prioridades
            </AppText>
          </AppStack>
        </AppInline>

        <AppGrid minItemWidth={130} gap="lg">
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
            helper={`${workload.instalacionesProgramadasHoy} para hoy`}
          />

          <Metric
            label="Atrasadas"
            value={workload.instalacionesAtrasadas}
            helper="Requieren atención"
          />
        </AppGrid>

        {requiresAttention ? (
          <AppAlert
            tone="warning"
            title="Trabajo que requiere atención"
            icon={AlertTriangle}
          >
            {workload.ticketsConMas48Horas} tickets superan 48 horas y{" "}
            {workload.instalacionesAtrasadas} instalaciones están atrasadas.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
