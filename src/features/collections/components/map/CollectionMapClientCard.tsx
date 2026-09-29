import { Navigation, UserRound } from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { CollectionClient } from "../../api/collections.contracts.api";
import { formatCollectionMoney } from "../../collections.helpers";

export interface CollectionMapClientCardProps {
  client: CollectionClient;
  onOpenRoute: (client: CollectionClient) => void;
}

export function CollectionMapClientCard({
  client,
  onOpenRoute,
}: CollectionMapClientCardProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={UserRound} size="md" tone="primary" decorative />
            <AppStack gap="xxs" flex>
              <AppText variant="bodyLarge" weight="semibold" numberOfLines={1}>
                {client.nombreCompleto}
              </AppText>
              <AppText variant="bodySmall" tone="secondary" numberOfLines={2}>
                {client.direccion || "Sin dirección registrada"}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge
            tone={client.totalDebe > 0 ? "danger" : "success"}
            variant="soft"
            size="sm"
          >
            {formatCollectionMoney(client.totalDebe)}
          </AppBadge>
        </AppInline>

        <AppButton
          size="sm"
          variant="solid"
          tone="primary"
          leadingIcon={Navigation}
          fullWidth
          onPress={() => onOpenRoute(client)}
        >
          Iniciar ruta en Maps
        </AppButton>
      </AppStack>
    </AppCard>
  );
}
