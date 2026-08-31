import {
  ClipboardList,
  MapPin,
  Siren,
  TicketCheck,
  Wrench,
} from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppStat,
  AppText,
} from "@/design-system";

import type { TicketStats } from "../tickets.helpers";

export interface TicketsAssignedSummaryProps {
  stats: TicketStats;
  isFetching?: boolean;
}

export function TicketsAssignedSummary({
  stats,
  isFetching = false,
}: TicketsAssignedSummaryProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={ClipboardList} size="md" tone="primary" decorative />

            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Tickets asignados
              </AppText>

              <AppInline gap="xs" align="center">
                <AppText variant="titleMedium" weight="bold">
                  {stats.total}
                </AppText>

                <AppBadge size="sm" tone="neutral" variant="soft">
                  Total
                </AppBadge>
              </AppInline>
            </AppStack>
          </AppInline>

          {isFetching ? (
            <AppBadge size="sm" tone="info" variant="soft">
              Actualizando
            </AppBadge>
          ) : null}
        </AppInline>

        <AppGrid gap="sm" minItemWidth={130}>
          <AppStat
            label="Urgentes"
            value={stats.urgentes}
            icon={Siren}
            tone="danger"
            variant="tonal"
          />

          <AppStat
            label="Nuevos"
            value={stats.nuevos}
            icon={TicketCheck}
            tone="success"
            variant="tonal"
          />

          <AppStat
            label="En proceso"
            value={stats.enProceso}
            icon={Wrench}
            tone="warning"
            variant="tonal"
          />

          <AppStat
            label="Con mapa"
            value={stats.conUbicacion}
            icon={MapPin}
            tone="info"
            variant="tonal"
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
