import { MapPin, Phone, UserRound } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { CustomerProfile } from "../api/customers.contracts.api";
import {
  formatCustomerMoney,
  formatCustomerStatus,
  getCustomerFullName,
  getCustomerStatusTone,
} from "../customers.helpers";

export interface CustomerProfileHeaderProps {
  customer: CustomerProfile;
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const fullName = getCustomerFullName(customer) || "Cliente sin nombre";

  const locationLabel = [
    customer.sector?.nombre,
    customer.municipio?.nombre,
    customer.departamento?.nombre,
  ]
    .filter(Boolean)
    .join(" · ");

  const addressLabel = customer.direccion?.trim() || locationLabel;
  const pendingBalance = Math.max(
    0,
    customer.saldoCliente?.saldoPendiente ?? 0,
  );
  const hasPendingBalance = pendingBalance > 0;

  return (
    <AppCard variant="outlined" tone="neutral" radius="lg" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center">
          <AppIcon icon={UserRound} size="md" tone="primary" decorative />

          <AppStack gap="xxs" flex>
            <AppText variant="titleSmall" weight="semibold" numberOfLines={2}>
              {fullName}
            </AppText>

            <AppText variant="caption" tone="secondary">
              Cliente #{customer.id}
            </AppText>
          </AppStack>
        </AppInline>

        <AppInline gap="xs" align="center" wrap>
          <AppBadge
            size="sm"
            variant="soft"
            tone={getCustomerStatusTone(customer.estadoCliente)}
          >
            {formatCustomerStatus(customer.estadoCliente)}
          </AppBadge>

          <AppBadge
            size="sm"
            variant="soft"
            tone={getCustomerStatusTone(customer.estadoCobranza)}
          >
            {formatCustomerStatus(customer.estadoCobranza)}
          </AppBadge>

          <AppBadge
            size="sm"
            variant="outlined"
            tone={hasPendingBalance ? "danger" : "success"}
          >
            {hasPendingBalance
              ? `Pendiente ${formatCustomerMoney(pendingBalance)}`
              : "Sin saldo pendiente"}
          </AppBadge>
        </AppInline>

        {customer.telefono ? (
          <AppInline gap="xs" align="center">
            <AppIcon icon={Phone} size="sm" tone="muted" decorative />
            <AppText variant="bodySmall" numberOfLines={1}>
              {customer.telefono}
            </AppText>
          </AppInline>
        ) : null}

        {addressLabel ? (
          <AppInline gap="xs" align="flex-start">
            <AppIcon icon={MapPin} size="sm" tone="muted" decorative />
            <AppText
              variant="bodySmall"
              tone="secondary"
              numberOfLines={2}
              style={{ flex: 1 }}
            >
              {addressLabel}
            </AppText>
          </AppInline>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
