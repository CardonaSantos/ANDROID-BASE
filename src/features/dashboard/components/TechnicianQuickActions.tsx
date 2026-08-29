import {
  ChevronRight,
  ClipboardList,
  Wrench,
  type LucideIcon,
} from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TechnicianPanelWorkload } from "../api";

interface TechnicianQuickActionsProps {
  workload: TechnicianPanelWorkload;

  onOpenTickets: () => void;

  onOpenInstallations: () => void;
}

interface QuickActionProps {
  icon: LucideIcon;

  title: string;

  description: string;

  value: number;

  helper: string;

  onPress: () => void;
}

function QuickAction({
  icon,
  title,
  description,
  value,
  helper,
  onPress,
}: QuickActionProps) {
  return (
    <AppCard
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <AppStack gap="md">
        <AppInline gap="md" align="center">
          <AppIcon icon={icon} size="lg" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              {title}
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              {description}
            </AppText>
          </AppStack>

          <AppIcon icon={ChevronRight} size="sm" tone="muted" decorative />
        </AppInline>

        <AppStack gap="xs">
          <AppText variant="titleMedium" weight="semibold">
            {value}
          </AppText>

          <AppText variant="bodySmall" tone="muted">
            {helper}
          </AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}

export function TechnicianQuickActions({
  workload,
  onOpenTickets,
  onOpenInstallations,
}: TechnicianQuickActionsProps) {
  return (
    <AppGrid minItemWidth={220} gap="md">
      <QuickAction
        icon={ClipboardList}
        title="Mis tickets"
        description="Soporte técnico asignado"
        value={workload.ticketsPendientes}
        helper={`${workload.ticketsListosParaTrabajar} listos · ${workload.ticketsUrgentes} urgentes`}
        onPress={onOpenTickets}
      />

      <QuickAction
        icon={Wrench}
        title="Mis instalaciones"
        description="Trabajo de campo asignado"
        value={workload.instalacionesPendientes}
        helper={`${workload.instalacionesProgramadasHoy} para hoy · ${workload.instalacionesAtrasadas} atrasadas`}
        onPress={onOpenInstallations}
      />
    </AppGrid>
  );
}
