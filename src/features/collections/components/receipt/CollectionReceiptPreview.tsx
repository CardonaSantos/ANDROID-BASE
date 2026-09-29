import { Receipt } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppDivider,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { CollectionInvoiceReceipt } from "../../api/collections.contracts.api";
import {
  getCollectionReceiptClientName,
  getCollectionReceiptTotalPaid,
} from "../../application/collection-receipt.document";
import {
  formatCollectionDateTime,
  formatCollectionMoney,
} from "../../collections.helpers";

export interface CollectionReceiptPreviewProps {
  receipt: CollectionInvoiceReceipt;
}

export function CollectionReceiptPreview({
  receipt,
}: CollectionReceiptPreviewProps) {
  const clientName = getCollectionReceiptClientName(receipt) || "Cliente";
  const totalPaid = getCollectionReceiptTotalPaid(receipt);

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={Receipt} size="md" tone="primary" decorative />

            <AppStack gap="xxs" flex>
              <AppText variant="titleMedium" weight="semibold">
                {receipt.empresa.nombre}
              </AppText>

              <AppText variant="caption" tone="secondary">
                Vista previa del comprobante térmico
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge tone="info" variant="soft" size="sm">
            80 mm
          </AppBadge>
        </AppInline>

        <AppDivider />

        <AppStack gap="xs">
          <AppInline gap="sm" align="center" justify="space-between">
            <AppText variant="bodySmall" tone="secondary">
              Recibo
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {`#${receipt.id}`}
            </AppText>
          </AppInline>

          <AppInline gap="sm" align="center" justify="space-between">
            <AppText variant="bodySmall" tone="secondary">
              Periodo
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {receipt.periodo}
            </AppText>
          </AppInline>

          <AppInline gap="sm" align="center" justify="space-between">
            <AppText variant="bodySmall" tone="secondary">
              Factura creada
            </AppText>
            <AppText variant="bodySmall" weight="semibold">
              {formatCollectionDateTime(receipt.creadoEn)}
            </AppText>
          </AppInline>
        </AppStack>

        <AppDivider />

        <AppStack gap="xs">
          <AppText variant="caption" tone="secondary" weight="medium">
            CLIENTE
          </AppText>

          <AppText variant="bodyMedium" weight="semibold">
            {clientName}
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="caption" tone="secondary" weight="medium">
            CONCEPTO
          </AppText>

          <AppText variant="bodySmall">
            {receipt.detalleFactura || "Pago de servicio de internet"}
          </AppText>
        </AppStack>

        <AppDivider />

        <AppStack gap="sm">
          <AppText variant="caption" tone="secondary" weight="medium" align="center">
            DETALLE PAGOS
          </AppText>

          {receipt.pagos.length > 0 ? (
            receipt.pagos.map((payment) => (
              <AppInline
                key={payment.id}
                gap="sm"
                align="center"
                justify="space-between"
              >
                <AppStack gap="xxs" flex>
                  <AppText variant="bodySmall" weight="semibold">
                    {payment.metodoPago}
                  </AppText>

                  <AppText variant="caption" tone="muted">
                    {formatCollectionDateTime(payment.fechaPago)}
                  </AppText>
                </AppStack>

                <AppText variant="bodySmall" weight="bold">
                  {formatCollectionMoney(payment.montoPagado)}
                </AppText>
              </AppInline>
            ))
          ) : (
            <AppText variant="bodySmall" tone="secondary" align="center">
              Sin pagos registrados.
            </AppText>
          )}
        </AppStack>

        <AppDivider />

        <AppInline gap="sm" align="center" justify="space-between">
          <AppText variant="titleMedium" weight="bold">
            TOTAL PAGADO
          </AppText>

          <AppText variant="titleLarge" weight="bold">
            {formatCollectionMoney(totalPaid)}
          </AppText>
        </AppInline>

        <AppText variant="caption" tone="muted" align="center">
          *** GRACIAS POR SU PAGO ***
        </AppText>
      </AppStack>
    </AppCard>
  );
}
