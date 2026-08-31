import { User } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketAssignedDetail } from "../../api/tickets.contracts.api";

import { TicketContactActions } from "../TicketContactActions";

export interface TicketContactSectionProps {
  ticket: TicketAssignedDetail;

  onCopyText: (value: string) => void | Promise<void>;
}

export function TicketContactSection({
  ticket,
  onCopyText,
}: TicketContactSectionProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={User} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Cliente
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              {`Cliente #${ticket.clientId}`}
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            NOMBRE
           =============================================== */}

        <AppStack gap="xs">
          <AppText variant="bodySmall" tone="secondary" weight="medium">
            Nombre
          </AppText>

          <AppText variant="titleMedium" weight="semibold">
            {ticket.clienteNombre || "Cliente sin nombre"}
          </AppText>
        </AppStack>

        {/* ===============================================
            CONTACTOS
           =============================================== */}

        <AppGrid gap="sm" minItemWidth={260}>
          <TicketContactActions
            label="Contacto principal"
            phone={ticket.clienteTel}
            onCopy={onCopyText}
          />

          <TicketContactActions
            label="Referencia"
            phone={ticket.referenciaContacto}
            compact
            onCopy={onCopyText}
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
