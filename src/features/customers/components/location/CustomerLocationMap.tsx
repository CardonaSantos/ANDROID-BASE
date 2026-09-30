import { AppAlert, AppStack, AppText } from "@/design-system";

import type { CustomerLocation } from "../../api/customers.contracts.api";

export interface CustomerLocationMapProps {
  location: CustomerLocation;
  title: string;
  height?: number;
}

export function CustomerLocationMap({
  location,
  title,
}: CustomerLocationMapProps) {
  return (
    <AppAlert tone="info" title="Ubicación del cliente">
      <AppStack gap="xs">
        <AppText variant="bodySmall">{title}</AppText>

        <AppText variant="caption" tone="secondary">
          {location.latitud}, {location.longitud}
        </AppText>

        <AppText variant="caption" tone="secondary">
          Maps está disponible.
        </AppText>
      </AppStack>
    </AppAlert>
  );
}
