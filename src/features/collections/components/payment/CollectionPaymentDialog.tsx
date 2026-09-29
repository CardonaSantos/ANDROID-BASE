import { useEffect, useMemo, useState } from "react";

import { Building2, Check } from "lucide-react-native";

import {
  AppButton,
  AppCard,
  AppDialog,
  AppIcon,
  AppInline,
  AppInput,
  AppListItem,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CollectionClient,
  CollectionInvoice,
  CollectionPaymentMethod,
} from "../../api/collections.contracts.api";
import {
  COLLECTION_PAYMENT_METHOD_OPTIONS,
  type CollectionPaymentFormState,
} from "../../application/collections.validation";
import { formatCollectionMoney } from "../../collections.helpers";

export interface CollectionPaymentDialogProps {
  open: boolean;
  client: CollectionClient | null;
  invoice: CollectionInvoice | null;
  form: CollectionPaymentFormState | null;
  validationMessage?: string | null;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onPatch: (patch: Partial<CollectionPaymentFormState>) => void;
  onContinue: () => void;
}

function PaymentMethodField({
  value,
  disabled,
  onChange,
}: {
  value: CollectionPaymentMethod;
  disabled: boolean;
  onChange: (value: CollectionPaymentMethod) => void;
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () =>
      COLLECTION_PAYMENT_METHOD_OPTIONS.find((option) => option.value === value) ??
      COLLECTION_PAYMENT_METHOD_OPTIONS[0],
    [value],
  );

  return (
    <AppStack gap="xs">
      <AppText variant="bodySmall" weight="semibold">
        Método de pago *
      </AppText>

      {/*
       * No usamos AppSelect dentro de AppDialog.
       * AppSelect se apoya en react-native-paper/Menu (Portal) y el diálogo
       * utiliza React Native Modal. En Android ese portal puede quedar detrás
       * del Modal, por lo que el menú cambia a visible pero no se ve.
       * Este selector permanece en el mismo árbol del diálogo y evita el
       * problema de capas sin modificar globalmente el Design System.
       */}
      <AppCard variant="outlined" radius="md" padding="none">
        <AppListItem
          size="sm"
          title={selectedOption.label}
          disclosure
          disabled={disabled}
          accessibilityLabel="Seleccionar método de pago"
          onPress={() => setOpen((current) => !current)}
        />
      </AppCard>

      {open ? (
        <AppCard variant="tonal" radius="md" padding="xs">
          <AppStack gap="xxs">
            {COLLECTION_PAYMENT_METHOD_OPTIONS.map((option) => {
              const selected = option.value === value;

              return (
                <AppListItem
                  key={option.value}
                  size="sm"
                  title={option.label}
                  selected={selected}
                  disabled={disabled}
                  trailing={
                    selected ? (
                      <AppIcon icon={Check} size="sm" tone="primary" decorative />
                    ) : undefined
                  }
                  accessibilityRole="radio"
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                />
              );
            })}
          </AppStack>
        </AppCard>
      ) : null}
    </AppStack>
  );
}

export function CollectionPaymentDialog({
  open,
  client,
  invoice,
  form,
  validationMessage,
  disabled = false,
  onOpenChange,
  onPatch,
  onContinue,
}: CollectionPaymentDialogProps) {
  const [pickerSession, setPickerSession] = useState(0);

  /*
   * Fuerza un estado limpio del selector cada vez que se cierra el diálogo.
   * PaymentMethodField se remonta con una key distinta en la siguiente sesión.
   */
  useEffect(() => {
    if (!open) {
      setPickerSession((current) => current + 1);
    }
  }, [open]);

  if (!client || !invoice || !form) {
    return null;
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar pago"
      tone="primary"
      size="sm"
      scrollable
      dismissable={!disabled}
      actions={
        <AppInline gap="xs" align="center" justify="flex-end">
          <AppButton
            size="sm"
            variant="ghost"
            tone="neutral"
            disabled={disabled}
            onPress={() => onOpenChange(false)}
          >
            Cancelar
          </AppButton>

          <AppButton
            size="sm"
            variant="solid"
            tone="primary"
            disabled={disabled}
            onPress={onContinue}
          >
            Continuar
          </AppButton>
        </AppInline>
      }
    >
      <AppStack gap="sm">
        <AppCard variant="tonal" radius="md" padding="sm">
          <AppInline gap="sm" align="center" justify="space-between">
            <AppStack gap="xxs" flex>
              <AppText variant="bodySmall" tone="secondary" numberOfLines={1}>
                {client.nombreCompleto}
              </AppText>

              <AppText variant="bodyMedium" weight="semibold">
                {`Factura #${invoice.id}`}
              </AppText>
            </AppStack>

            <AppText variant="bodyMedium" weight="bold">
              {formatCollectionMoney(invoice.saldoPendiente)}
            </AppText>
          </AppInline>
        </AppCard>

        {validationMessage ? (
          <AppText variant="bodySmall" tone="danger">
            {validationMessage}
          </AppText>
        ) : null}

        <AppInput
          size="sm"
          label="Monto a pagar"
          value={form.montoPagado}
          onChangeText={(value) => onPatch({ montoPagado: value })}
          keyboardType="decimal-pad"
          placeholder="0.00"
          leading={<AppText weight="semibold">Q</AppText>}
          disabled={disabled}
          required
        />

        <PaymentMethodField
          key={pickerSession}
          value={form.metodoPago}
          disabled={disabled}
          onChange={(value) => onPatch({ metodoPago: value })}
        />

        {form.metodoPago === "DEPOSITO" ? (
          <AppInput
            size="sm"
            label="Número de boleta"
            value={form.numeroBoleta}
            onChangeText={(value) => onPatch({ numeroBoleta: value })}
            placeholder="Número de boleta"
            leading={<Building2 size={16} />}
            disabled={disabled}
            required
          />
        ) : null}

        <AppInput
          size="sm"
          label="Observaciones"
          value={form.observaciones}
          onChangeText={(value) => onPatch({ observaciones: value })}
          placeholder="Opcional"
          multiline
          numberOfLines={2}
          disabled={disabled}
        />
      </AppStack>
    </AppDialog>
  );
}
