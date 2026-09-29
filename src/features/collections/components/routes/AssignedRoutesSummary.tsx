import { Map, Users } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

export interface AssignedRoutesSummaryProps {
  totalRoutes: number;

  totalClients: number;
}

export function AssignedRoutesSummary({
  totalRoutes,
  totalClients,
}: AssignedRoutesSummaryProps) {
  return (
    <AppGrid gap="xs" minItemWidth={120}>
      {/* =================================================
          RUTAS
         ================================================= */}

      <AppCard variant="tonal" tone="primary" radius="md" padding="sm">
        <AppStack gap="xs">
          <AppInline gap="xs" align="center">
            <AppIcon icon={Map} size="sm" tone="primary" decorative />

            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Rutas
            </AppText>
          </AppInline>

          <AppText variant="titleLarge" weight="bold">
            {totalRoutes}
          </AppText>
        </AppStack>
      </AppCard>

      {/* =================================================
          CLIENTES
         ================================================= */}

      <AppCard variant="tonal" tone="info" radius="md" padding="sm">
        <AppStack gap="xs">
          <AppInline gap="xs" align="center">
            <AppIcon icon={Users} size="sm" tone="info" decorative />

            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Clientes
            </AppText>
          </AppInline>

          <AppText variant="titleLarge" weight="bold">
            {totalClients}
          </AppText>
        </AppStack>
      </AppCard>
    </AppGrid>
  );
}
