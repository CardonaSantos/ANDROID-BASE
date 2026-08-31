import { ClipboardList, Router, type LucideIcon } from "lucide-react-native";

import {
  AppBadge,
  AppButton,
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

interface TechnicianQuickActionCardProps {
  icon: LucideIcon;

  title: string;

  description: string;

  pending: number;

  badgeTone: "neutral" | "danger" | "warning";

  actionLabel: string;

  actionVariant: "solid" | "outlined";

  onPress: () => void;
}

function TechnicianQuickActionCard({
  icon,
  title,
  description,
  pending,
  badgeTone,
  actionLabel,
  actionVariant,
  onPress,
}: TechnicianQuickActionCardProps) {
  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="md">
        <AppInline gap="md" align="flex-start" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={icon} size="md" tone="default" decorative />

            <AppStack gap="xxs" flex>
              <AppText variant="titleSmall" weight="semibold">
                {title}
              </AppText>

              <AppText variant="bodySmall" tone="muted">
                {description}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge tone={badgeTone} variant="soft" size="sm">
            {`${pending} ${pending === 1 ? "pendiente" : "pendientes"}`}
          </AppBadge>
        </AppInline>

        <AppButton
          fullWidth
          variant={actionVariant}
          tone={actionVariant === "outlined" ? "neutral" : "primary"}
          onPress={onPress}
          accessibilityLabel={actionLabel}
        >
          {actionLabel}
        </AppButton>
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
    <AppGrid minItemWidth={260} gap="md">
      <TechnicianQuickActionCard
        icon={ClipboardList}
        title="Mis tickets"
        description="Soporte asignado"
        pending={workload.ticketsPendientes}
        badgeTone={workload.ticketsUrgentes > 0 ? "danger" : "neutral"}
        actionLabel="Ver tickets asignados"
        actionVariant="solid"
        onPress={onOpenTickets}
      />

      <TechnicianQuickActionCard
        icon={Router}
        title="Mis instalaciones"
        description="Trabajo de campo asignado"
        pending={workload.instalacionesPendientes}
        badgeTone={workload.instalacionesAtrasadas > 0 ? "warning" : "neutral"}
        actionLabel="Ver instalaciones asignadas"
        actionVariant="outlined"
        onPress={onOpenInstallations}
      />
    </AppGrid>
  );
}
