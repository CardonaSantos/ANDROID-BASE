import { FileText, StickyNote } from "lucide-react-native";

import {
  AppCard,
  AppDivider,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketAssignedDetail } from "../../api/tickets.contracts.api";

export interface TicketDescriptionSectionProps {
  ticket: TicketAssignedDetail;
}

export function TicketDescriptionSection({
  ticket,
}: TicketDescriptionSectionProps) {
  const description = ticket.descripcion?.trim() ?? "";

  const observations = ticket.observaciones.trim();

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={FileText} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Información técnica
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            DESCRIPCIÓN
           =============================================== */}

        <AppStack gap="sm">
          <AppText variant="bodyMedium">
            {description || "Sin descripción registrada."}
          </AppText>
        </AppStack>

        <AppDivider />

        {/* ===============================================
            OBSERVACIONES
           =============================================== */}

        <AppStack gap="sm">
          <AppInline gap="xs" align="center">
            <AppIcon icon={StickyNote} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary" weight="semibold">
              Observaciones
            </AppText>
          </AppInline>

          <AppText variant="bodyMedium">
            {observations || "Sin observaciones registradas."}
          </AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
