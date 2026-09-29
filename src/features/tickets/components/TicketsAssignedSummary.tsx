import { ClipboardList, Siren, TicketCheck, Wrench } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
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
    <AppCard variant="outlined" radius="lg" padding="sm">
      <AppStack gap="sm">
        {/* =================================================
            RESUMEN GENERAL
           ================================================= */}

        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={ClipboardList} size="sm" tone="primary" decorative />

            <AppText variant="bodyMedium" weight="semibold">
              Tickets asignados
            </AppText>

            <AppBadge size="sm" tone="primary" variant="soft">
              {stats.total}
            </AppBadge>
          </AppInline>

          {isFetching ? (
            <AppBadge size="sm" tone="info" variant="soft">
              Actualizando
            </AppBadge>
          ) : null}
        </AppInline>

        {/* =================================================
            MÉTRICAS COMPACTAS
           ================================================= */}

        <AppGrid gap="xs" minItemWidth={95}>
          {/* URGENTES */}

          <AppCard variant="tonal" tone="danger" radius="md" padding="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon icon={Siren} size="sm" tone="danger" decorative />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  Urgentes
                </AppText>
              </AppInline>

              <AppText variant="titleMedium" weight="bold">
                {stats.urgentes}
              </AppText>
            </AppStack>
          </AppCard>

          {/* NUEVOS */}

          <AppCard variant="tonal" tone="success" radius="md" padding="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon
                  icon={TicketCheck}
                  size="sm"
                  tone="success"
                  decorative
                />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  Nuevos
                </AppText>
              </AppInline>

              <AppText variant="titleMedium" weight="bold">
                {stats.nuevos}
              </AppText>
            </AppStack>
          </AppCard>

          {/* EN PROCESO */}

          <AppCard variant="tonal" tone="warning" radius="md" padding="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon icon={Wrench} size="sm" tone="warning" decorative />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  En proceso
                </AppText>
              </AppInline>

              <AppText variant="titleMedium" weight="bold">
                {stats.enProceso}
              </AppText>
            </AppStack>
          </AppCard>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
