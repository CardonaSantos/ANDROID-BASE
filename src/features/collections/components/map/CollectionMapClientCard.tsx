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
  onOpenProfile: (clientId: number) => void;
}

export function CollectionMapClientCard({
  client,
  onOpenRoute,
  onOpenProfile,
}: CollectionMapClientCardProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={UserRound} size="sm" tone="primary" decorative />
            <AppStack gap="xxs" flex>
              <AppText variant="bodyMedium" weight="semibold" numberOfLines={1}>
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

        <AppInline gap="xs" align="center" wrap>
          <AppButton
            size="sm"
            variant="soft"
            tone="primary"
            leadingIcon={UserRound}
            onPress={() => onOpenProfile(client.id)}
          >
            Ver perfil
          </AppButton>

          <AppButton
            size="sm"
            variant="outlined"
            tone="neutral"
            leadingIcon={Navigation}
            onPress={() => onOpenRoute(client)}
          >
            Iniciar ruta
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
