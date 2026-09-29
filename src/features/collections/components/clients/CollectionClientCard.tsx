import {
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  UserRound,
} from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppIcon,
  AppInline,
  AppListItem,
  AppPressable,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CollectionClient,
  CollectionInvoice,
} from "../../api/collections.contracts.api";
import {
  formatCollectionLastPayment,
  formatCollectionMoney,
  hasCollectionLocation,
} from "../../collections.helpers";
import { CollectionInvoiceCard } from "../invoices/CollectionInvoiceCard";

export interface CollectionClientCardProps {
  client: CollectionClient;
  expanded: boolean;
  selected: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onCopyText: (value: string) => void | Promise<void>;
  onCallPhone: (phone: string) => void;
  onOpenRoute: (client: CollectionClient) => void;
  onOpenProfile: (clientId: number) => void;
  onOpenPayment: (client: CollectionClient, invoice: CollectionInvoice) => void;
  onOpenReceipt: (invoiceId: number) => void;
}

function ContactActions({
  phone,
  label,
  onCopyText,
  onCallPhone,
}: {
  phone?: string | null;
  label: string;
  onCopyText: (value: string) => void | Promise<void>;
  onCallPhone: (phone: string) => void;
}) {
  const cleanPhone = phone?.trim() ?? "";
  const hasPhone = cleanPhone.length > 0;

  return (
    <AppListItem
      size="sm"
      title={label}
      description={hasPhone ? cleanPhone : "No registrado"}
      leading={<AppIcon icon={Phone} size="sm" tone="muted" decorative />}
      trailing={
        <AppInline gap="xs" align="center">
          <AppButton
            size="sm"
            variant="ghost"
            tone="neutral"
            leadingIcon={ClipboardCopy}
            disabled={!hasPhone}
            accessibilityLabel={`Copiar ${label}`}
            onPress={() => {
              if (hasPhone) {
                void onCopyText(cleanPhone);
              }
            }}
          >
            Copiar
          </AppButton>

          <AppButton
            size="sm"
            variant="ghost"
            tone="neutral"
            leadingIcon={PhoneCall}
            disabled={!hasPhone}
            accessibilityLabel={`Llamar a ${label}`}
            onPress={() => {
              if (hasPhone) {
                onCallPhone(cleanPhone);
              }
            }}
          >
            Llamar
          </AppButton>
        </AppInline>
      }
    />
  );
}

export function CollectionClientCard({
  client,
  expanded,
  selected,
  onExpandedChange,
  onCopyText,
  onCallPhone,
  onOpenRoute,
  onOpenProfile,
  onOpenPayment,
  onOpenReceipt,
}: CollectionClientCardProps) {
  const hasLocation = hasCollectionLocation(client.ubicacion);

  return (
    <AppCard
      variant="outlined"
      tone={selected ? "primary" : "neutral"}
      radius="lg"
      padding="none"
      selected={selected}
    >
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel={`Cliente ${client.nombreCompleto}`}
        accessibilityState={{ expanded }}
        interaction="subtle"
        radius="lg"
        onPress={() => onExpandedChange(!expanded)}
        style={styles.header}
      >
        <AppInline gap="md" align="center">
          <AppIcon
            icon={UserRound}
            size="md"
            tone={selected ? "primary" : "muted"}
            decorative
          />

          <AppStack gap="xxs" flex>
            <AppInline gap="sm" align="center" justify="space-between">
              <AppText
                variant="bodyLarge"
                weight="semibold"
                numberOfLines={1}
                style={styles.clientName}
              >
                {client.nombreCompleto || "Cliente sin nombre"}
              </AppText>

              <AppBadge
                tone={client.totalDebe > 0 ? "danger" : "success"}
                variant="soft"
                size="sm"
              >
                {formatCollectionMoney(client.totalDebe)}
              </AppBadge>
            </AppInline>

            <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
              {`${client.facturas.length} factura${client.facturas.length === 1 ? "" : "s"} · Último pago: ${formatCollectionLastPayment(client.saldo.ultimoPago)}`}
            </AppText>
          </AppStack>

          <AppIcon
            icon={expanded ? ChevronUp : ChevronDown}
            size="sm"
            tone="secondary"
            decorative
          />
        </AppInline>
      </AppPressable>

      {expanded ? (
        <AppStack gap="md" style={styles.content}>
          <AppButton
            size="sm"
            variant="soft"
            tone="primary"
            leadingIcon={UserRound}
            fullWidth
            onPress={() => onOpenProfile(client.id)}
          >
            Ver perfil del cliente
          </AppButton>

          <AppStack gap="xs">
            <AppInline gap="xs" align="flex-start">
              <AppIcon icon={MapPin} size="sm" tone="muted" decorative />
              <AppText variant="bodySmall" tone="secondary" style={{ flex: 1 }}>
                {client.direccion?.trim() || "Sin dirección registrada"}
              </AppText>
            </AppInline>
          </AppStack>

          <AppStack gap="xs">
            <ContactActions
              label="Teléfono"
              phone={client.telefono}
              onCopyText={onCopyText}
              onCallPhone={onCallPhone}
            />

            <ContactActions
              label="Referencia"
              phone={client.contactoReferencia.telefono}
              onCopyText={onCopyText}
              onCallPhone={onCallPhone}
            />
          </AppStack>

          <AppButton
            size="sm"
            variant="soft"
            tone="primary"
            leadingIcon={Navigation}
            fullWidth
            disabled={!hasLocation}
            accessibilityLabel={`Abrir ruta hacia ${client.nombreCompleto}`}
            onPress={() => onOpenRoute(client)}
          >
            {hasLocation ? "Iniciar ruta en Maps" : "Ubicación no disponible"}
          </AppButton>

          <AppStack gap="sm">
            <AppText variant="titleSmall" weight="semibold">
              Facturas pendientes
            </AppText>

            {client.facturas.length > 0 ? (
              client.facturas.map((invoice) => (
                <CollectionInvoiceCard
                  key={invoice.id}
                  client={client}
                  invoice={invoice}
                  onOpenPayment={onOpenPayment}
                  onOpenReceipt={onOpenReceipt}
                />
              ))
            ) : (
              <AppText variant="bodySmall" tone="secondary">
                No hay facturas pendientes para este cliente.
              </AppText>
            )}
          </AppStack>
        </AppStack>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  clientName: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
}));
