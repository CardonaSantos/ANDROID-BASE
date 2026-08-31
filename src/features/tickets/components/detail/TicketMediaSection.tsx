import { ImageIcon } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketMedia } from "../../api/tickets.contracts.api";

import { TicketMediaStrip } from "../TicketMediaStrip";

export interface TicketMediaSectionProps {
  medias: readonly TicketMedia[];
}

export function TicketMediaSection({ medias }: TicketMediaSectionProps) {
  const mediaCount = medias.length;

  /*
   * Cuando existen evidencias reutilizamos
   * TicketMediaStrip completo.
   *
   * Ese componente ya resuelve:
   *
   * - thumbnails;
   * - carrusel;
   * - modal;
   * - pantalla completa;
   * - navegación anterior/siguiente.
   *
   * Evitamos duplicar otro visor diferente
   * solamente para la pantalla de detalle.
   */
  if (mediaCount > 0) {
    return (
      <AppStack gap="sm">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={ImageIcon} size="md" tone="primary" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="titleMedium" weight="semibold">
                Evidencia
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                Archivos asociados al ticket.
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge
            size="sm"
            tone="info"
            variant="soft"
            accessibilityLabel={`${mediaCount} archivos de evidencia`}
          >
            {mediaCount}
          </AppBadge>
        </AppInline>

        <TicketMediaStrip medias={medias} />
      </AppStack>
    );
  }

  /*
   * El strip devuelve null cuando no hay medias,
   * por lo que la sección controla explícitamente
   * el estado vacío.
   */
  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md" align="center">
        <AppIcon icon={ImageIcon} size="lg" tone="muted" decorative />

        <AppStack gap="xs" align="center">
          <AppText variant="titleMedium" weight="semibold" align="center">
            Sin evidencia
          </AppText>

          <AppText variant="bodySmall" tone="secondary" align="center">
            Este ticket no tiene archivos de evidencia registrados.
          </AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
