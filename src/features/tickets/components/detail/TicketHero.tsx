import { CalendarClock, ImageIcon } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketAssignedDetail } from "../../api/tickets.contracts.api";

import { formatTicketDate } from "../../tickets.helpers";

import { TicketPriorityBadge } from "../TicketPriorityBadge";

import { TicketStatusBadge } from "../TicketStatusBadge";

export interface TicketHeroProps {
  ticket: TicketAssignedDetail;
}

export function TicketHero({ ticket }: TicketHeroProps) {
  const mediaCount = ticket.medias.length;

  return (
    <AppCard
      variant="outlined"
      radius="lg"
      padding="md"
      accessibilityLabel={`Ticket ${ticket.id}: ${
        ticket.titulo || "Sin título"
      }`}
    >
      <AppStack gap="md">
        {/* ===============================================
            ESTADO / PRIORIDAD / EVIDENCIA
           =============================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between" wrap>
          <AppInline gap="xs" align="center" wrap flex>
            <TicketStatusBadge status={ticket.estado} />

            <TicketPriorityBadge priority={ticket.prioridad} />

            {mediaCount > 0 ? (
              <AppBadge
                size="sm"
                tone="info"
                variant="soft"
                icon={ImageIcon}
                accessibilityLabel={`${mediaCount} adjuntos`}
              >
                {mediaCount}
              </AppBadge>
            ) : null}
          </AppInline>

          <AppInline gap="xs" align="center">
            <AppIcon icon={CalendarClock} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary">
              {formatTicketDate(ticket.abiertoEn)}
            </AppText>
          </AppInline>
        </AppInline>

        {/* ===============================================
            IDENTIFICADOR
           =============================================== */}

        <AppText variant="bodySmall" tone="secondary" weight="medium">
          {`Ticket #${ticket.id}`}
        </AppText>

        {/* ===============================================
            TÍTULO
           =============================================== */}

        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            {ticket.titulo || "Ticket sin título"}
          </AppText>

          <AppText variant="bodyMedium" tone="secondary">
            {ticket.descripcion || "Sin descripción registrada."}
          </AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
