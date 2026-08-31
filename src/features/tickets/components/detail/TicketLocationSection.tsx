import { MapPin } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketAssignedDetail } from "../../api/tickets.contracts.api";

import { getTicketAddressText } from "../../tickets.helpers";

import { TicketLocationActions } from "../TicketLocationActions";

export interface TicketLocationSectionProps {
  ticket: TicketAssignedDetail;

  onCopyText: (value: string) => void | Promise<void>;
}

export function TicketLocationSection({
  ticket,
  onCopyText,
}: TicketLocationSectionProps) {
  const addressText = getTicketAddressText(ticket.direccion);

  const sector = ticket.direccion.sector.trim();

  const municipio = ticket.direccion.municipio.trim();

  const hasLocation = Boolean(ticket.ubicacionMaps);

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={MapPin} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Ubicación
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Dirección y ubicación registrada del cliente.
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            DIRECCIÓN
           =============================================== */}

        <AppStack gap="xs">
          <AppText variant="bodySmall" tone="secondary" weight="medium">
            Dirección
          </AppText>

          <AppText variant="bodyMedium" weight="semibold">
            {addressText || "Sin dirección registrada"}
          </AppText>
        </AppStack>

        {/* ===============================================
            DATOS ESTRUCTURADOS
           =============================================== */}

        <AppGrid gap="sm" minItemWidth={140}>
          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Sector
            </AppText>

            <AppText variant="bodyMedium">
              {sector || "Sin sector registrado"}
            </AppText>
          </AppStack>

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Municipio
            </AppText>

            <AppText variant="bodyMedium">
              {municipio || "Sin municipio registrado"}
            </AppText>
          </AppStack>
        </AppGrid>

        {/* ===============================================
            MAPA
           =============================================== */}

        {hasLocation ? (
          <TicketLocationActions
            location={ticket.ubicacionMaps}
            onCopy={onCopyText}
          />
        ) : (
          <AppText variant="bodySmall" tone="secondary">
            Este ticket no tiene coordenadas GPS registradas.
          </AppText>
        )}
      </AppStack>
    </AppCard>
  );
}
