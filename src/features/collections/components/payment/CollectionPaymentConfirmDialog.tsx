import { AlertTriangle } from "lucide-react-native";

import {
  AppCard,
  AppConfirmDialog,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CollectionClient,
  CollectionInvoice,
  CreateCollectionPaymentInput,
} from "../../api/collections.contracts.api";
import { formatCollectionMoney } from "../../collections.helpers";

export interface CollectionPaymentConfirmDialogProps {
  open: boolean;
  client: CollectionClient | null;
  invoice: CollectionInvoice | null;
  input: CreateCollectionPaymentInput | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function CollectionPaymentConfirmDialog({
  open,
  client,
  invoice,
  input,
  onOpenChange,
  onConfirm,
  onCancel,
}: CollectionPaymentConfirmDialogProps) {
  if (!client || !invoice || !input) {
    return null;
  }

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirmar pago"
      description="Esta acción registrará el pago sobre la factura seleccionada."
      icon={AlertTriangle}
      tone="warning"
      confirmTone="primary"
      confirmLabel="Registrar pago"
      cancelLabel="Volver"
      dismissable={false}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <AppCard variant="tonal" radius="md" padding="sm">
        <AppStack gap="sm">
          <AppText variant="bodyMedium" weight="semibold">
            {client.nombreCompleto}
          </AppText>

          <AppInline gap="sm" align="center" justify="space-between">
            <AppText variant="bodySmall" tone="secondary">
              {`Factura #${invoice.id}`}
            </AppText>

            <AppText variant="bodyMedium" weight="semibold">
              {formatCollectionMoney(input.montoPagado)}
            </AppText>
          </AppInline>

          <AppText variant="bodySmall" tone="secondary">
            {`Método: ${input.metodoPago}`}
          </AppText>
        </AppStack>
      </AppCard>
    </AppConfirmDialog>
  );
}
