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
  /*
   * =======================================================
   * CLIENT
   * =======================================================
   *
   * Los tickets operativos pueden existir sin un
   * ClienteInternet asociado.
   *
   * No utilizamos valores artificiales como 0 o -1.
   * null representa realmente la ausencia de relación.
   * =======================================================
   */

  const hasClient = ticket.clientId !== null;

  const clientLabel = hasClient
    ? `Cliente #${ticket.clientId}`
    : "Sin cliente asociado";

  const clientName = hasClient
    ? ticket.clienteNombre || "Cliente sin nombre"
    : "Sin cliente asociado";

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
              {clientLabel}
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
            {clientName}
          </AppText>
        </AppStack>

        {/* ===============================================
            CONTACTOS
           =============================================== */}

        {hasClient ? (
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
        ) : (
          <AppText variant="bodySmall" tone="secondary">
            Este ticket no tiene información de contacto de cliente asociada.
          </AppText>
        )}
      </AppStack>
    </AppCard>
  );
}
