import { CalendarDays, Map, Play, UserRound, Users } from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { AssignedRouteListItem } from "../../api/collections.contracts.api";
import { formatCollectionDate } from "../../collections.helpers";

export interface AssignedRouteCardProps {
  route: AssignedRouteListItem;
  onOpen: (routeId: number) => void;
}

export function AssignedRouteCard({
  route,
  onOpen,
}: AssignedRouteCardProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline gap="md" align="flex-start" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={Map} size="md" tone="primary" decorative />

            <AppStack gap="xxs" flex>
              <AppText variant="titleMedium" weight="semibold" numberOfLines={2}>
                {route.nombreRuta || "Ruta sin nombre"}
              </AppText>

              <AppText variant="caption" tone="muted">
                {`Ruta #${route.id}`}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge icon={Users} tone="info" variant="soft" size="sm">
            {route._count.clientes}
          </AppBadge>
        </AppInline>

        <AppStack gap="xs">
          <AppInline gap="xs" align="center">
            <AppIcon icon={UserRound} size="sm" tone="muted" decorative />
            <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
              {route.cobrador?.nombre ?? "Sin cobrador"}
            </AppText>

            {route.cobrador?.rol ? (
              <AppBadge tone="neutral" variant="soft" size="sm">
                {route.cobrador.rol}
              </AppBadge>
            ) : null}
          </AppInline>

          <AppInline gap="xs" align="center">
            <AppIcon icon={CalendarDays} size="sm" tone="muted" decorative />
            <AppText variant="bodySmall" tone="secondary">
              {formatCollectionDate(route.creadoEn)}
            </AppText>
          </AppInline>
        </AppStack>

        {route.observaciones ? (
          <AppText variant="bodySmall" tone="secondary" numberOfLines={2}>
            {route.observaciones}
          </AppText>
        ) : null}

        <AppButton
          size="sm"
          variant="solid"
          tone="primary"
          leadingIcon={Play}
          fullWidth
          accessibilityLabel={`Abrir ruta ${route.nombreRuta}`}
          onPress={() => onOpen(route.id)}
        >
          Iniciar ruta
        </AppButton>
      </AppStack>
    </AppCard>
  );
}
