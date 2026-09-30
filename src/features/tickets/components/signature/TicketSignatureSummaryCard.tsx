import { AppCard, AppInline, AppStack } from "@/design-system";

import type { TicketConformityDetail } from "../../api/ticket-conformity.contracts.api";

interface TicketSignatureSummaryCardProps {
  conformity: TicketConformityDetail;
  signer: "technician" | "client";
}

export function TicketSignatureSummaryCard({}: TicketSignatureSummaryCardProps) {
  // const clientName = conformity.cliente?.nombreCompleto?.trim();

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center">
          {/* <AppIcon icon={UserRound} size="sm" tone="muted" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="bodySmall" tone="secondary">
              {signer === "technician"
                ? "Cliente asociado"
                : "Persona que firma"}
            </AppText>

            <AppText variant="bodyMedium" weight="semibold" numberOfLines={1}>
              {clientName || "Cliente sin nombre"}
            </AppText>
          </AppStack> */}
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
