import { PenLine, UserRound } from "lucide-react-native";

import {
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketConformityDetail } from "../../api/ticket-conformity.contracts.api";

interface TicketSignatureSummaryCardProps {
  conformity: TicketConformityDetail;
  signer: "technician" | "client";
}

export function TicketSignatureSummaryCard({
  conformity,
  signer,
}: TicketSignatureSummaryCardProps) {
  const clientName = conformity.cliente?.nombreCompleto?.trim();

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center">
          <AppIcon icon={PenLine} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="bodySmall" tone="secondary">
              Ticket #{conformity.ticket.id}
            </AppText>

            <AppText variant="titleMedium" weight="semibold" numberOfLines={2}>
              {conformity.ticket.titulo || "Ticket sin título"}
            </AppText>
          </AppStack>
        </AppInline>

        <AppInline gap="sm" align="center">
          <AppIcon icon={UserRound} size="sm" tone="muted" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="bodySmall" tone="secondary">
              {signer === "technician" ? "Cliente asociado" : "Persona que firma"}
            </AppText>

            <AppText variant="bodyMedium" weight="semibold" numberOfLines={1}>
              {clientName || "Cliente sin nombre"}
            </AppText>
          </AppStack>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
