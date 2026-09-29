import { BadgeCheck, Printer } from "lucide-react-native";

import {
  AppButton,
  AppDialog,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import { formatCollectionMoney } from "../../collections.helpers";

export interface CollectionPaymentSuccessDialogProps {
  open: boolean;
  invoiceId: number | null;
  amount: number | null;
  onOpenChange: (open: boolean) => void;
  onStay: () => void;
  onOpenReceipt: (invoiceId: number) => void;
}

export function CollectionPaymentSuccessDialog({
  open,
  invoiceId,
  amount,
  onOpenChange,
  onStay,
  onOpenReceipt,
}: CollectionPaymentSuccessDialogProps) {
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Pago registrado"
      description="El cobro fue registrado correctamente."
      icon={BadgeCheck}
      tone="success"
      size="sm"
      actions={
        <AppInline gap="sm" align="center" justify="flex-end" wrap>
          <AppButton variant="ghost" tone="neutral" onPress={onStay}>
            Seguir cobrando
          </AppButton>

          <AppButton
            variant="solid"
            tone="primary"
            leadingIcon={Printer}
            disabled={!invoiceId}
            onPress={() => {
              if (invoiceId) {
                onOpenReceipt(invoiceId);
              }
            }}
          >
            Imprimir comprobante
          </AppButton>
        </AppInline>
      }
    >
      <AppStack gap="xs">
        {invoiceId ? (
          <AppText variant="bodyMedium" weight="semibold">
            {`Factura #${invoiceId}`}
          </AppText>
        ) : null}

        {amount !== null ? (
          <AppText variant="headlineSmall" weight="bold">
            {formatCollectionMoney(amount)}
          </AppText>
        ) : null}

        <AppText variant="bodySmall" tone="secondary">
          El comprobante mostrará el historial acumulado de pagos de esta
          factura y podrá enviarse al sistema de impresión de Android.
        </AppText>
      </AppStack>
    </AppDialog>
  );
}
