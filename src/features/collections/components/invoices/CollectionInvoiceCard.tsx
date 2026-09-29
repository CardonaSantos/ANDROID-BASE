import { HandCoins, Printer } from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppStack,
  AppText,
  type ComponentTone,
} from "@/design-system";

import type {
  CollectionClient,
  CollectionInvoice,
} from "../../api/collections.contracts.api";
import {
  formatCollectionDate,
  formatCollectionMoney,
} from "../../collections.helpers";

function getInvoiceTone(status: string): ComponentTone {
  switch (status) {
    case "PAGADA":
      return "success";
    case "PARCIAL":
      return "warning";
    case "PENDIENTE":
    case "VENCIDA":
      return "danger";
    default:
      return "neutral";
  }
}

export interface CollectionInvoiceCardProps {
  client: CollectionClient;
  invoice: CollectionInvoice;
  onOpenPayment: (client: CollectionClient, invoice: CollectionInvoice) => void;
  onOpenReceipt: (invoiceId: number) => void;
}

export function CollectionInvoiceCard({
  client,
  invoice,
  onOpenPayment,
  onOpenReceipt,
}: CollectionInvoiceCardProps) {
  const paid =
    invoice.estadoFactura === "PAGADA" || invoice.saldoPendiente <= 0;

  return (
    <AppCard variant="outlined" radius="md" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppText variant="bodyMedium" weight="semibold">
            {`Factura #${invoice.id}`}
          </AppText>

          <AppBadge
            tone={getInvoiceTone(invoice.estadoFactura)}
            variant="soft"
            size="sm"
          >
            {invoice.estadoFactura}
          </AppBadge>
        </AppInline>

        <AppGrid gap="sm" minItemWidth={120}>
          <AppStack gap="xxs">
            <AppText variant="caption" tone="muted">
              Monto
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {formatCollectionMoney(invoice.montoPago)}
            </AppText>
          </AppStack>

          <AppStack gap="xxs">
            <AppText variant="caption" tone="muted">
              Pendiente
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {formatCollectionMoney(invoice.saldoPendiente)}
            </AppText>
          </AppStack>

          <AppStack gap="xxs">
            <AppText variant="caption" tone="muted">
              Fecha
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {formatCollectionDate(invoice.creadoEn)}
            </AppText>
          </AppStack>
        </AppGrid>

        <AppGrid gap="xs" minItemWidth={130}>
          <AppButton
            size="sm"
            variant="outlined"
            tone="neutral"
            leadingIcon={Printer}
            fullWidth
            accessibilityLabel={`Abrir comprobante de factura ${invoice.id}`}
            onPress={() => onOpenReceipt(invoice.id)}
          >
            Comprobante
          </AppButton>

          <AppButton
            size="sm"
            variant="solid"
            tone="primary"
            leadingIcon={HandCoins}
            fullWidth
            disabled={paid}
            accessibilityLabel={`Registrar pago de factura ${invoice.id}`}
            onPress={() => onOpenPayment(client, invoice)}
          >
            Registrar pago
          </AppButton>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
