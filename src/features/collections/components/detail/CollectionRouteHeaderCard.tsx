import {
  CalendarDays,
  FileText,
  UserRound,
  Users,
  Wallet,
} from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { CollectionRouteDetail } from "../../api/collections.contracts.api";
import {
  getCollectionRouteDebtTotal,
  getCollectionRoutePendingInvoiceCount,
} from "../../application/collections.selectors";
import {
  formatCollectionDate,
  formatCollectionMoney,
} from "../../collections.helpers";

export interface CollectionRouteHeaderCardProps {
  route: CollectionRouteDetail;
}

export function CollectionRouteHeaderCard({
  route,
}: CollectionRouteHeaderCardProps) {
  const pendingInvoices = getCollectionRoutePendingInvoiceCount(route);
  const debtTotal = getCollectionRouteDebtTotal(route);

  return (
    <AppCard variant="outlined" radius="lg" padding="sm">
      <AppStack gap="sm">
        {/* ===================================================
        CABECERA
       =================================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between">
          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold" numberOfLines={1}>
              {route.nombreRuta || "Ruta de cobro"}
            </AppText>

            <AppInline gap="sm" align="center" wrap>
              <AppInline gap="xs" align="center">
                <AppIcon icon={UserRound} size="sm" tone="muted" decorative />

                <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
                  {route.cobrador?.nombre ?? "Sin cobrador"}
                </AppText>
              </AppInline>

              <AppInline gap="xs" align="center">
                <AppIcon
                  icon={CalendarDays}
                  size="sm"
                  tone="muted"
                  decorative
                />

                <AppText variant="bodySmall" tone="secondary">
                  {formatCollectionDate(route.creadoEn)}
                </AppText>
              </AppInline>
            </AppInline>
          </AppStack>
        </AppInline>

        {/* ===================================================
        MÉTRICAS COMPACTAS
       =================================================== */}

        <AppGrid gap="xs" minItemWidth={95}>
          <AppCard variant="tonal" tone="info" radius="md" padding="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon icon={Users} size="sm" tone="info" decorative />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  Clientes
                </AppText>
              </AppInline>

              <AppText variant="titleSmall" weight="bold">
                {route.clientes.length}
              </AppText>
            </AppStack>
          </AppCard>

          <AppCard variant="tonal" tone="warning" radius="md" padding="xs">
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon icon={FileText} size="sm" tone="warning" decorative />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  Facturas
                </AppText>
              </AppInline>

              <AppText variant="titleSmall" weight="bold">
                {pendingInvoices}
              </AppText>
            </AppStack>
          </AppCard>

          <AppCard
            variant="tonal"
            tone={debtTotal > 0 ? "danger" : "success"}
            radius="md"
            padding="xs"
          >
            <AppStack gap="xs">
              <AppInline gap="xs" align="center">
                <AppIcon
                  icon={Wallet}
                  size="sm"
                  tone={debtTotal > 0 ? "danger" : "success"}
                  decorative
                />

                <AppText
                  variant="labelSmall"
                  tone="secondary"
                  numberOfLines={1}
                >
                  Por cobrar
                </AppText>
              </AppInline>

              <AppText variant="titleSmall" weight="bold" numberOfLines={1}>
                {formatCollectionMoney(debtTotal)}
              </AppText>
            </AppStack>
          </AppCard>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
